import { dbQuery } from '../../../../utils/db.js'

export default defineEventHandler(async (event) => {
  const bookSlug = String(event.context.params.bookSlug || '').trim()
  if (!bookSlug) throw createError({ statusCode: 400, statusMessage: 'Invalid bookSlug' })

  const bookRows = await dbQuery('SELECT * FROM books WHERE slug = ?', [bookSlug])
  const book = bookRows[0]
  if (!book) throw createError({ statusCode: 404, statusMessage: 'Book not found' })

  const rows = await dbQuery(
    `
    SELECT * FROM parts WHERE book_id = ?
    ORDER BY part_no ASC, id ASC
    `,
    [book.id]
  )

  return { book: { slug: book.slug, id: book.id }, parts: rows }
})
