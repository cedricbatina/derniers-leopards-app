import { dbQuery } from '../../../../utils/db.js'

export default defineEventHandler(async (event) => {
  const bookSlug = String(event.context.params.bookSlug || '').trim()
  if (!bookSlug) throw createError({ statusCode: 400, statusMessage: 'Invalid bookSlug' })

  const bookRows = await dbQuery('SELECT * FROM books WHERE slug = ?', [bookSlug])
  const book = bookRows[0]
  if (!book) throw createError({ statusCode: 404, statusMessage: 'Book not found' })

  const body = await readBody(event)
  if (!body?.title) throw createError({ statusCode: 400, statusMessage: 'Missing title'})

  const result = await dbQuery(
    `INSERT INTO parts (book_id, part_no, title, summary, created_at, updated_at)
     VALUES (?, ?, ?, ?, NOW(), NOW())`,
    [book.id, body.part_no || 1, body.title, body.summary || null]
  )

  return { success: true, part_id: result.insertId }
})
