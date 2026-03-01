import { dbQuery } from '../../../../../../utils/db.js'
import { getBookByAccess } from '../../../../../../utils/projects.js'

function toSlug(input) {
  return String(input || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user?.id) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const bookSlug = String(event.context.params.bookSlug || '').trim()
  if (!bookSlug) throw createError({ statusCode: 400, statusMessage: 'Invalid bookSlug' })

  const book = await getBookByAccess(user, bookSlug)
  if (!book) throw createError({ statusCode: 404, statusMessage: 'Book not found' })

  const body = await readBody(event)

  const name = String(body?.name || '').trim()
  if (!name) throw createError({ statusCode: 400, statusMessage: 'name is required' })

  const slug = toSlug(body?.slug || name) || `character-${Date.now()}`
  const description = body?.description ? String(body.description).trim() : null

  try {
    await dbQuery(
      `
      INSERT INTO characters (book_id, slug, name, description)
      VALUES (?, ?, ?, ?)
      `,
      [book.id, slug, name, description]
    )
  } catch (err) {
    if (String(err?.code) === 'ER_DUP_ENTRY') {
      throw createError({ statusCode: 409, statusMessage: 'Character slug already exists in this book' })
    }
    throw err
  }

  const rows = await dbQuery(
    `SELECT id, book_id, slug, name, description, created_at, updated_at
     FROM characters
     WHERE book_id=? AND slug=?
     LIMIT 1`,
    [book.id, slug]
  )

  return { character: rows[0] || null }
})
