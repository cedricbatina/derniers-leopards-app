import { dbQuery } from '../../../../../../utils/db.js'
import { getBookByAccess } from '../../../../../../utils/projects.js'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user?.id) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const bookSlug = String(event.context.params.bookSlug || '').trim()
  const characterSlug = String(event.context.params.characterSlug || '').trim()
  if (!bookSlug || !characterSlug) throw createError({ statusCode: 400, statusMessage: 'Invalid params' })

  const book = await getBookByAccess(user, bookSlug)
  if (!book) throw createError({ statusCode: 404, statusMessage: 'Book not found' })

  const res = await dbQuery(
    `
    UPDATE characters
    SET deleted_at = NOW()
    WHERE book_id=? AND slug=? AND deleted_at IS NULL
    `,
    [book.id, characterSlug]
  )

  if (!res?.affectedRows) throw createError({ statusCode: 404, statusMessage: 'Not found' })
  return { ok: true }
})
