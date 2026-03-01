import { dbQuery } from '../../../../../../utils/db.js'
import { getBookByAccess } from '../../../../../../utils/projects.js'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user?.id) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const bookSlug = String(event.context.params.bookSlug || '').trim()
  const body = await readBody(event).catch(() => ({}))

  // Backward-compat: this endpoint is /characters/restore (no :characterSlug)
  // so we accept slug from body.
  const characterSlug = String(
    event.context.params.characterSlug || body?.characterSlug || body?.character_slug || body?.slug || ''
  ).trim()

  if (!bookSlug || !characterSlug) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid params' })
  }

  const book = await getBookByAccess(user, bookSlug)
  if (!book) {
    throw createError({ statusCode: 404, statusMessage: 'Book not found' })
  }

  const res = await dbQuery(
    `
    UPDATE characters
    SET deleted_at = NULL
    WHERE book_id = ? AND slug = ? AND deleted_at IS NOT NULL
    `,
    [book.id, characterSlug]
  )

  if (!res?.affectedRows) {
    throw createError({ statusCode: 404, statusMessage: 'Not found' })
  }

  const rows = await dbQuery(
    `
    SELECT id, book_id, slug, name, description, created_at, updated_at, deleted_at
    FROM characters
    WHERE book_id = ? AND slug = ?
    LIMIT 1
    `,
    [book.id, characterSlug]
  )

  return { ok: true, character: rows[0] || null }
})
