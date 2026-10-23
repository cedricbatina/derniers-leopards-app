// server/api/projects/[projectSlug]/characters/index.get.js
import { dbQuery } from '../../../../utils/db.js'
import { getProjectForNarrativeApi, canManageProject } from '../../../../utils/projects.js'

export default defineEventHandler(async (event) => {
  const user = event.context.user

  const projectSlug = String(event.context.params.projectSlug || '').trim()
  if (!projectSlug) throw createError({ statusCode: 400, statusMessage: 'Invalid projectSlug' })

  const project = await getProjectForNarrativeApi(user, projectSlug)
  if (!project) throw createError({ statusCode: 404, statusMessage: 'Project not found' })

  const { q, trashed } = getQuery(event)
  const query = (q ? String(q).trim() : '') || null
  const trashedFlag =
    canManageProject(project, user) && String(trashed || '') === '1' ? 1 : 0

  const rows = await dbQuery(
    `
    SELECT 
      id, project_id, slug, name, description,
      created_at, updated_at, deleted_at
    FROM characters
    WHERE project_id = ?
      AND (
        (? = 1 AND deleted_at IS NOT NULL) OR
        (? = 0 AND deleted_at IS NULL)
      )
      AND (
        ? IS NULL
        OR name LIKE CONCAT('%', ?, '%')
        OR slug LIKE CONCAT('%', ?, '%')
        OR description LIKE CONCAT('%', ?, '%')
      )
    ORDER BY name ASC, id ASC
    LIMIT 500
    `,
    [
      project.id,
      trashedFlag,
      trashedFlag,
      query,
      query,
      query,
      query,
    ]
  )

  return { project: { slug: project.slug, id: project.id }, characters: rows }
})