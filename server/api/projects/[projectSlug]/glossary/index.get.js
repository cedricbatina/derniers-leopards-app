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

  const { q, lang } = getQuery(event)
  const query = (q ? String(q).trim() : '') || null
  const langQuery = (lang ? String(lang).trim() : '') || null

  const where = []
  const params = []

  where.push('book_id=?')
  params.push(book.id)

  if (langQuery) {
    where.push('language=?')
    params.push(langQuery)
  }

  // Glossary columns
  const cols = new Set(['id', 'slug', 'term', 'definition', 'language'])
  const termCol = pickColumn(cols, ['term', 'mot', 'mot_fr', 'mot_en'])
  const defCol = pickColumn(cols, ['definition', 'def', 'def_fr', 'def_en'])

  if (query) {
    const likeParts = []
    if (termCol) {
      likeParts.push(`${termCol} LIKE CONCAT('%', ?, '%')`)
      params.push(query)
    }
    if (cols.has('slug')) {
      likeParts.push(`slug LIKE CONCAT('%', ?, '%')`)
      params.push(query)
    }
    if (defCol) {
      likeParts.push(`${defCol} LIKE CONCAT('%', ?, '%')`)
      params.push(query)
    }
    if (likeParts.length) where.push(`(${likeParts.join(' OR ')})`)
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : ''
  const orderSql = termCol ? `ORDER BY ${termCol} ASC` : (cols.has('id') ? 'ORDER BY id DESC' : '')

  const rows = await dbQuery(
    `
    SELECT * FROM glossary_terms
    ${whereSql}
    ${orderSql}
    LIMIT 500
    `,
    params
  )

  return { terms: rows }
})
