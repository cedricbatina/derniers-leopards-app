import { dbQuery } from '../../../../utils/db.js'
import { getProjectByOwnerSlug } from '../../../../utils/projects.js'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user?.id) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const projectSlug = String(event.context.params.projectSlug || '').trim()
  if (!projectSlug) throw createError({ statusCode: 400, statusMessage: 'Invalid projectSlug' })

  const project = await getProjectByOwnerSlug(user.id, projectSlug)
  if (!project) throw createError({ statusCode: 404, statusMessage: 'Project not found' })

  const { q } = getQuery(event)
  const query = (q ? String(q).trim() : '') || null

  const rows = await dbQuery(
    `
    SELECT id, project_id, slug, name, description, created_at, updated_at
    FROM characters
    WHERE project_id = ?
      AND (? IS NULL OR name LIKE CONCAT('%', ?, '%') OR slug LIKE CONCAT('%', ?, '%'))
    ORDER BY name ASC, id ASC
    LIMIT 500
    `,
    [project.id, query, query, query]
  )

  return { project: { slug: project.slug, id: project.id }, characters: rows }
})
