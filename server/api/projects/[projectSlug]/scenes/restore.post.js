//server\api\projects\[projectSlug]\scenes\restore.post.js
import { dbQuery } from '../../../../utils/db.js'
import { getProjectByAccess } from '../../../../utils/projects.js'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user?.id) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const projectSlug = String(event.context.params.projectSlug || '').trim()
  const body = await readBody(event).catch(() => ({}))

  // Backward-compat: this endpoint is /scenes/restore (no :sceneSlug)
  // so we accept slug from body.
  const sceneSlug = String(
    event.context.params.sceneSlug || body?.sceneSlug || body?.scene_slug || body?.slug || ''
  ).trim()

  if (!projectSlug || !sceneSlug) throw createError({ statusCode: 400, statusMessage: 'Invalid params' })

  const project = await getProjectByAccess(user, projectSlug)
  if (!project) throw createError({ statusCode: 404, statusMessage: 'Project not found' })

  const res = await dbQuery(
    `
    UPDATE scenes
    SET deleted_at = NULL
    WHERE project_id=? AND slug=? AND deleted_at IS NOT NULL
    `,
    [project.id, sceneSlug]
  )

  if (!res?.affectedRows) throw createError({ statusCode: 404, statusMessage: 'Not found' })
  return { ok: true }
})
