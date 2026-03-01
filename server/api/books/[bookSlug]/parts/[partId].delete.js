import { dbQuery } from '../../../../utils/db.js'

export default defineEventHandler(async (event) => {
  const bookSlug = String(event.context.params.bookSlug || '').trim()
  const partId = Number(event.context.params.partId)
  if (!bookSlug || !partId) throw createError({ statusCode: 400, statusMessage: 'Invalid params' })

  const bookRows = await dbQuery('SELECT * FROM books WHERE slug = ?', [bookSlug])
  const book = bookRows[0]
  if (!book) throw createError({ statusCode: 404, statusMessage: 'Book not found' })

  await dbQuery('DELETE FROM parts WHERE id = ? AND book_id = ?', [partId, book.id])

  return { success: true }
})
