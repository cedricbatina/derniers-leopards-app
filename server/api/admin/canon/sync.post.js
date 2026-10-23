/**
 * POST /api/admin/canon/sync
 * Body JSON: { project_slug, restore_trashed?, targets? }
 * Auth: session cookie + admin (see assertAdmin).
 */
import { defineEventHandler, readBody, createError } from 'h3'
import { assertAdmin } from '../../../utils/admin.js'
import { dbQuery } from '../../../utils/db.js'
import { assertValidProjectSlugForCanon } from '../../../utils/canonSyncRequest.js'
import { syncCanonCharactersFromFiles } from '../../../utils/canonCharacterSync.js'

const ALLOWED_TARGETS = Object.freeze(['characters', 'scenes'])

export default defineEventHandler(async (event) => {
  await assertAdmin(event)

  const body = await readBody(event).catch(() => ({}))
  const rawSlug = String(body?.project_slug ?? body?.projectSlug ?? '').trim()

  const slugCheck = assertValidProjectSlugForCanon(rawSlug)
  if (!slugCheck.ok) {
    throw createError({
      statusCode: 400,
      statusMessage: slugCheck.message || 'Invalid project_slug',
      data: { code: slugCheck.errorCode || 'INVALID_PROJECT_SLUG' },
    })
  }

  const projectSlug = slugCheck.slug
  const restoreTrashed = !!(body?.restore_trashed ?? body?.restoreTrashed)

  const rawTargets = body?.targets
  const targets =
    Array.isArray(rawTargets) && rawTargets.length
      ? [...new Set(rawTargets.map((t) => String(t).toLowerCase().trim()).filter(Boolean))]
      : ['characters']

  const unknown = targets.filter((t) => !ALLOWED_TARGETS.includes(t))
  if (unknown.length) {
    throw createError({
      statusCode: 400,
      statusMessage: `Unknown target(s): ${unknown.join(', ')}. Allowed: ${ALLOWED_TARGETS.join(', ')}`,
      data: { code: 'INVALID_TARGETS', targets: unknown },
    })
  }

  const projRows = await dbQuery(
    `SELECT id, slug, title
     FROM projects
     WHERE slug = ? AND deleted_at IS NULL
     LIMIT 1`,
    [projectSlug],
  )
  if (!projRows?.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Project not found',
      data: { code: 'PROJECT_NOT_FOUND', project_slug: projectSlug },
    })
  }
  const project = projRows[0]

  const payload = {
    ok: true,
    project: { id: project.id, slug: project.slug, title: project.title },
    restore_trashed: restoreTrashed,
    targets,
  }

  if (targets.includes('characters')) {
    try {
      payload.characters = await syncCanonCharactersFromFiles(project.id, { restoreTrashed })
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : typeof err === 'string' ? err : 'Canon character sync failed'
      const short = msg.length > 500 ? `${msg.slice(0, 497)}…` : msg
      throw createError({
        statusCode: 500,
        statusMessage: short,
        data: { code: 'CANON_CHARACTER_SYNC_FAILED' },
      })
    }
  } else {
    payload.characters = null
  }

  if (targets.includes('scenes')) {
    payload.scenes = {
      skipped: true,
      reason:
        'Scene canon sync is not implemented yet (no curated text-file pipeline). Use targets: ["characters"] only.',
    }
  } else {
    payload.scenes = null
  }

  return payload
})
