import { dbQuery } from '../../../../../../utils/db.js'

export default defineEventHandler(async (event) => {
  const bookSlug = String(event.context.params.bookSlug || '').trim()
  const characterSlug = String(event.context.params.characterSlug || '').trim()
  if (!bookSlug || !characterSlug) throw createError({ statusCode: 400, statusMessage: 'Invalid params' })

  // Récupère le livre
  const bookRows = await dbQuery('SELECT * FROM books WHERE slug = ?', [bookSlug])
  const book = bookRows[0]
  if (!book) throw createError({ statusCode: 404, statusMessage: 'Book not found' })

  const { trashed } = getQuery(event)
  const allowTrashed = String(trashed || '') === '1' ? 1 : 0

  const rows = await dbQuery(
    `
     SELECT id, book_id, slug, name, description, created_at, updated_at, deleted_at
     FROM characters
     WHERE book_id=? AND slug=? AND (? = 1 OR deleted_at IS NULL)
     LIMIT 1
     `,
    [book.id, characterSlug, allowTrashed]
  )

  if (!rows?.length) throw createError({ statusCode: 404, statusMessage: 'Not found' })
  return { character: rows[0] }
})
