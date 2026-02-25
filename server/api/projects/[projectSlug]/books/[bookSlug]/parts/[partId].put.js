import { dbQuery } from '../../../../../../utils/db.js'
import { getProjectByOwnerSlug } from '../../../../../../utils/projects.js'
import { getBookByProjectIdSlug } from '../../../../../../utils/books.js'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user?.id) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const projectSlug = String(event.context.params.projectSlug || '').trim()
  const bookSlug = String(event.context.params.bookSlug || '').trim()
  const partId = Number(event.context.params.partId)
  if (!projectSlug || !bookSlug || !Number.isFinite(partId) || partId <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid params' })
  }

  const project = await getProjectByOwnerSlug(user.id, projectSlug)
  if (!project) throw createError({ statusCode: 404, statusMessage: 'Project not found' })

  const book = await getBookByProjectIdSlug(project.id, bookSlug)
  if (!book) throw createError({ statusCode: 404, statusMessage: 'Book not found' })

  const rows0 = await dbQuery(
    `SELECT id, slug FROM parts WHERE id=? AND book_id=? LIMIT 1`,
    [partId, book.id]
  )
  if (!rows0?.length) throw createError({ statusCode: 404, statusMessage: 'Not found' })

  const body = await readBody(event)
  if (body?.slug !== undefined) {
    throw createError({ statusCode: 400, statusMessage: 'slug is immutable' })
  }

  const allowed = ['title', 'part_no', 'summary']
  const hasAny = allowed.some((k) => body?.[k] !== undefined)
  if (!hasAny) throw createError({ statusCode: 400, statusMessage: 'No fields to update' })

  const sets = []
  const params = []

  if (body.title !== undefined) {
    const title = String(body.title || '').trim()
    if (!title) throw createError({ statusCode: 400, statusMessage: 'title cannot be empty' })
    sets.push('title=?')
    params.push(title)
  }

  if (body.part_no !== undefined) {
    const partNo = Number(body.part_no)
    if (!Number.isFinite(partNo) || partNo <= 0) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid part_no' })
    }
    sets.push('part_no=?')
    params.push(partNo)
  }

  if (body.summary !== undefined) {
    sets.push('summary=?')
    params.push(body.summary ? String(body.summary).trim() : null)
  }

  await dbQuery(
    `UPDATE parts SET ${sets.join(', ')} WHERE id=? AND book_id=?`,
    [...params, partId, book.id]
  )

  const rows = await dbQuery(
    `
    SELECT id, book_id, slug, part_no, title, summary, created_at, updated_at
    FROM parts
    WHERE id=? AND book_id=?
    LIMIT 1
    `,
    [partId, book.id]
  )

  return { part: rows?.[0] || null }
})
