// server/api/projects/[projectSlug]/chapters/index.get.js
import { dbQuery } from '../../../../utils/db.js'
import { getProjectByOwnerSlug } from '../../../../utils/projects.js'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user?.id) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const projectSlug = String(event.context.params.projectSlug || '').trim()
  if (!projectSlug) throw createError({ statusCode: 400, statusMessage: 'Invalid projectSlug' })

  const project = await getProjectByOwnerSlug(user.id, projectSlug)
  if (!project) throw createError({ statusCode: 404, statusMessage: 'Project not found' })

  // Minimal fields only (avoid coupling to optional columns like title/deleted_at).
  const rows = await dbQuery(
    `
    SELECT id, project_id, chapter_no
    FROM chapters
    WHERE project_id=?
    ORDER BY chapter_no ASC, id ASC
    LIMIT 2000
    `,
    [project.id]
  )

  return { project: { slug: project.slug, id: project.id }, chapters: rows }
})
