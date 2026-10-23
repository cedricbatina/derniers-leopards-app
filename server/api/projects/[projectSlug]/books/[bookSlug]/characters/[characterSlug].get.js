import { dbQuery } from '../../../../../../utils/db.js'
import { getBookForNarrativeApi, canManageBook } from '../../../../../../utils/projects.js'

export default defineEventHandler(async (event) => {
  const user = event.context.user

  const bookSlug = String(event.context.params.bookSlug || '').trim()
  const characterSlug = String(event.context.params.characterSlug || '').trim()
  if (!bookSlug || !characterSlug) throw createError({ statusCode: 400, statusMessage: 'Invalid params' })

  const book = await getBookForNarrativeApi(user, bookSlug)
  if (!book) throw createError({ statusCode: 404, statusMessage: 'Book not found' })

  const { trashed } = getQuery(event)
  const allowTrashed = canManageBook(book, user) && String(trashed || '') === '1' ? 1 : 0

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
