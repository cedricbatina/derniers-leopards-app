import { dbQuery } from '../../../../../../utils/db.js'

export default defineEventHandler(async (event) => {
  const bookSlug = String(event.context.params.bookSlug || '').trim()
  if (!bookSlug) throw createError({ statusCode: 400, statusMessage: 'Invalid bookSlug' })

  // Récupère le livre
  const bookRows = await dbQuery('SELECT * FROM books WHERE slug = ?', [bookSlug])
  const book = bookRows[0]
  if (!book) throw createError({ statusCode: 404, statusMessage: 'Book not found' })

  const { q, trashed } = getQuery(event)
  const query = (q ? String(q).trim() : '') || null
  const trashedFlag = String(trashed || '') === '1' ? 1 : 0

  const rows = await dbQuery(
    `
    SELECT id, book_id, slug, name, description, created_at, updated_at, deleted_at
    FROM characters
    WHERE book_id = ?
      AND ((? = 1 AND deleted_at IS NOT NULL) OR (? = 0 AND deleted_at IS NULL))
      AND (? IS NULL OR name LIKE CONCAT('%', ?, '%') OR slug LIKE CONCAT('%', ?, '%'))
    ORDER BY name ASC, id ASC
    LIMIT 500
    `,
    [book.id, trashedFlag, trashedFlag, query, query, query]
  )

  return { book: { slug: book.slug, id: book.id }, characters: rows }
})
