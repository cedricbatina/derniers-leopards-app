// server/api/projects/[projectSlug]/chapters/index.get.js
import { dbQuery } from '../../../../utils/db.js'
import { getProjectByAccess } from '../../../../utils/projects.js'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user?.id) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const projectSlug = String(event.context.params.projectSlug || '').trim()
  if (!projectSlug) throw createError({ statusCode: 400, statusMessage: 'Invalid projectSlug' })

  const project = await getProjectByAccess(user, projectSlug)
  if (!project) throw createError({ statusCode: 404, statusMessage: 'Project not found' })

  // Schéma réel : chapters.part_id → parts.book_id (pas de chapters.book_id).
  const rows = await dbQuery(
    `
    SELECT
      c.id,
      p.book_id AS book_id,
      c.part_id,
      c.slug,
      c.chapter_no,
      c.title,
      p.part_no,
      p.title AS part_title
    FROM chapters c
    INNER JOIN parts p ON p.id = c.part_id
    INNER JOIN books b ON b.id = p.book_id AND b.project_id = ? AND b.deleted_at IS NULL
    ORDER BY b.id ASC, p.part_no ASC, c.chapter_no ASC, c.id ASC
    LIMIT 2000
    `,
    [project.id]
  )

  return { project: { slug: project.slug, id: project.id }, chapters: rows }
})
