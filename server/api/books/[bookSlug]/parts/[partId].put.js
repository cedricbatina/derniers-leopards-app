import { dbQuery } from '../../../../utils/db.js'

export default defineEventHandler(async (event) => {
  const bookSlug = String(event.context.params.bookSlug || '').trim()
  const partId = Number(event.context.params.partId)
  if (!bookSlug || !partId) throw createError({ statusCode: 400, statusMessage: 'Invalid params' })

  const bookRows = await dbQuery('SELECT * FROM books WHERE slug = ?', [bookSlug])
  const book = bookRows[0]
  if (!book) throw createError({ statusCode: 404, statusMessage: 'Book not found' })

  const body = await readBody(event)
  if (!body?.title) throw createError({ statusCode: 400, statusMessage: 'Missing title'})

  await dbQuery(
    `UPDATE parts SET title=?, summary=?, part_no=?, updated_at=NOW() WHERE id=? AND book_id=?`,
    [body.title, body.summary || null, body.part_no || 1, partId, book.id]
  )

  return { success: true }
})
