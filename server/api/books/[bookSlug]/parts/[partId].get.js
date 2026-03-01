import { dbQuery } from '../../../../utils/db.js'

export default defineEventHandler(async (event) => {
  const bookSlug = String(event.context.params.bookSlug || '').trim()
  const partId = Number(event.context.params.partId)
  if (!bookSlug || !partId) throw createError({ statusCode: 400, statusMessage: 'Invalid params' })

  const bookRows = await dbQuery('SELECT * FROM books WHERE slug = ?', [bookSlug])
  const book = bookRows[0]
  if (!book) throw createError({ statusCode: 404, statusMessage: 'Book not found' })

  const rows = await dbQuery('SELECT * FROM parts WHERE book_id = ? AND id = ?', [book.id, partId])
  const part = rows[0]
  if (!part) throw createError({ statusCode: 404, statusMessage: 'Part not found' })

  return { book: { slug: book.slug, id: book.id }, part }
})
