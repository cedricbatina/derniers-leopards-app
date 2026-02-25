import { dbQuery } from '../../../../../../utils/db.js'
import { getProjectByOwnerSlug } from '../../../../../../utils/projects.js'
import { getBookByProjectIdSlug } from '../../../../../../utils/books.js'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user?.id) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const projectSlug = String(event.context.params.projectSlug || '').trim()
  const bookSlug = String(event.context.params.bookSlug || '').trim()
  if (!projectSlug || !bookSlug) throw createError({ statusCode: 400, statusMessage: 'Invalid params' })

  const project = await getProjectByOwnerSlug(user.id, projectSlug)
  if (!project) throw createError({ statusCode: 404, statusMessage: 'Project not found' })

  const book = await getBookByProjectIdSlug(project.id, bookSlug)
  if (!book) throw createError({ statusCode: 404, statusMessage: 'Book not found' })

  const rows = await dbQuery(
    `
    SELECT id, book_id, slug, part_no, title, summary, created_at, updated_at
    FROM parts
    WHERE book_id=?
    ORDER BY part_no ASC, id ASC
    LIMIT 500
    `,
    [book.id]
  )

  return {
    project: { id: project.id, slug: project.slug },
    book: { id: book.id, slug: book.slug },
    parts: rows,
  }
})
