import { dbQuery } from '../../../../utils/db.js'

function pickColumn(cols, candidates) {
  return candidates.find((c) => cols.has(c)) || null
}

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user?.id) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const bookSlug = String(event.context.params.bookSlug || '').trim()
  if (!bookSlug) throw createError({ statusCode: 400, statusMessage: 'Invalid bookSlug' })

  // Récupère le livre
  const bookRows = await dbQuery('SELECT * FROM books WHERE slug = ?', [bookSlug])
  const book = bookRows[0]
  if (!book) throw createError({ statusCode: 404, statusMessage: 'Book not found' })

  const { q } = getQuery(event)
  const query = (q ? String(q).trim() : '') || null

  const where = []
  const params = []

  where.push('book_id=?')
  params.push(book.id)

  if (query) {
    where.push('(title LIKE CONCAT("%", ?, "%") OR slug LIKE CONCAT("%", ?, "%") OR summary LIKE CONCAT("%", ?, "%"))')
    params.push(query, query, query)
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : ''
  const orderSql = 'ORDER BY event_date ASC, id ASC'

  const rows = await dbQuery(
    `
    SELECT * FROM timeline_events
    ${whereSql}
    ${orderSql}
    LIMIT 500
    `,
    params
  )

  return { book: { slug: book.slug, id: book.id }, events: rows }
})
