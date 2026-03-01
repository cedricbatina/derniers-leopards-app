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

  const body = await readBody(event)
  if (body?.slug !== undefined) {
    throw createError({ statusCode: 400, statusMessage: 'slug is immutable' })
  }

  const rows0 = await dbQuery(
    `SELECT id FROM characters WHERE book_id=? AND slug=? AND deleted_at IS NULL LIMIT 1`,
    [book.id, characterSlug]
  )

  if (!rows0?.length) throw createError({ statusCode: 404, statusMessage: 'Not found' })
  const characterId = rows0[0].id

  const allowed = ['name', 'description']
  const hasAny = allowed.some((k) => body?.[k] !== undefined)
  if (!hasAny) throw createError({ statusCode: 400, statusMessage: 'No fields to update' })

  const sets = []
  const params = []

  if (body.name !== undefined) {
    const name = String(body.name || '').trim()
    if (!name) throw createError({ statusCode: 400, statusMessage: 'name cannot be empty' })
    sets.push('name=?'); params.push(name)
  }
  if (body.description !== undefined) {
    sets.push('description=?')
    params.push(body.description ? String(body.description).trim() : null)
  }

  await dbQuery(
    `UPDATE characters SET ${sets.join(', ')} WHERE id=? AND book_id=?`,
    [...params, characterId, book.id]
  )

  const rows = await dbQuery(
    `SELECT id, book_id, slug, name, description, created_at, updated_at
     FROM characters
     WHERE id=? AND book_id=? LIMIT 1`,
    [characterId, book.id]
  )

  return { character: rows[0] }
})
