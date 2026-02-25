// server/api/projects/[projectSlug]/chapters/index.get.js
import { dbQuery } from '../../../../utils/db.js'
import { getProjectByOwnerSlug } from '../../../../utils/projects.js'
import { tableHasColumn } from '../../../../utils/schema.js'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user?.id) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const projectSlug = String(event.context.params.projectSlug || '').trim()
  if (!projectSlug) throw createError({ statusCode: 400, statusMessage: 'Invalid projectSlug' })

  const project = await getProjectByOwnerSlug(user.id, projectSlug)
  if (!project) throw createError({ statusCode: 404, statusMessage: 'Project not found' })

  const hasProjectId = await tableHasColumn('chapters', 'project_id')

  const rows = hasProjectId
    ? await dbQuery(
      `
      SELECT
        c.id, c.project_id, c.part_id, c.slug, c.chapter_no, c.title,
        p.part_no, p.title AS part_title
      FROM chapters c
      LEFT JOIN parts p ON p.id = c.part_id
      WHERE c.project_id=?
      ORDER BY p.part_no ASC, c.chapter_no ASC, c.id ASC
      LIMIT 2000
      `,
      [project.id]
    )
    : await dbQuery(
      `
      SELECT
        c.id, b.project_id, c.part_id, c.slug, c.chapter_no, c.title,
        p.part_no, p.title AS part_title
      FROM chapters c
      JOIN parts p ON p.id = c.part_id
      JOIN books b ON b.id = p.book_id
      WHERE b.project_id=?
      ORDER BY p.part_no ASC, c.chapter_no ASC, c.id ASC
      LIMIT 2000
      `,
      [project.id]
    )

  return { project: { slug: project.slug, id: project.id }, chapters: rows }
})
