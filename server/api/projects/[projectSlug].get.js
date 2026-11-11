// server/api/projects/[slug].get.js
import { dbQuery } from '~~/server/utils/db.js'
import { canManageProject, getProjectForNarrativeApi } from '~~/server/utils/projects.js'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  const userId = Number(user?.id || user?.sub)
  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const projectSlug = String(event.context.params.projectSlug || event.context.params.slug || '').trim()
  if (!projectSlug) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid projectSlug' })
  }

  const access = await getProjectForNarrativeApi(user, projectSlug)
  if (!access) throw createError({ statusCode: 404, statusMessage: 'Not found' })

  const rows = await dbQuery(
    `
    SELECT
      id, owner_id,
      slug, public_slug,
      title, title_en, title_pt,
      logline, pitch, cover_url,
      status, visibility,
      published_at,
      created_at, updated_at, deleted_at,
      parent_id, type
    FROM projects
    WHERE id = ? AND deleted_at IS NULL
    LIMIT 1
    `,
    [access.id],
  )

  if (!rows?.length) throw createError({ statusCode: 404, statusMessage: 'Not found' })
  const project = rows[0]
  const manage = canManageProject(project, user)
  return {
    project: {
      ...project,
      can_manage: manage,
      access_role: manage ? 'owner' : 'viewer',
    },
  }
})
