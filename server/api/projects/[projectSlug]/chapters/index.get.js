// server/api/projects/[projectSlug]/chapters/index.get.js
import { dbQuery } from '../../../../utils/db.js'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user?.id) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const bookSlug = String(event.context.params.bookSlug || '').trim()
  if (!bookSlug) throw createError({ statusCode: 400, statusMessage: 'Invalid bookSlug' })

  // Récupère le livre
  const bookRows = await dbQuery('SELECT * FROM books WHERE slug = ?', [bookSlug])
  const book = bookRows[0]
  if (!book) throw createError({ statusCode: 404, statusMessage: 'Book not found' })

  const rows = await dbQuery(
    `
    SELECT
      c.id, c.book_id, c.part_id, c.slug, c.chapter_no, c.title,
      p.part_no, p.title AS part_title
    FROM chapters c
    LEFT JOIN parts p ON p.id = c.part_id
    WHERE c.book_id=?
    ORDER BY p.part_no ASC, c.chapter_no ASC, c.id ASC
    LIMIT 2000
    `,
    [book.id]
  )

  return { book: { slug: book.slug, id: book.id }, chapters: rows }
})
