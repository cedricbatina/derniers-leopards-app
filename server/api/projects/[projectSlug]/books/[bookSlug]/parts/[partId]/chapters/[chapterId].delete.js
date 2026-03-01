import { dbQuery } from '../../../../../../../../utils/db.js'
import { getProjectByAccess } from '../../../../../../../../utils/projects.js'
import { getBookByProjectIdSlug } from '../../../../../../../../utils/books.js'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user?.id) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const projectSlug = String(event.context.params.projectSlug || '').trim()
  const bookSlug = String(event.context.params.bookSlug || '').trim()
  const partId = Number(event.context.params.partId)
  const chapterId = Number(event.context.params.chapterId)
  if (!projectSlug || !bookSlug || !Number.isFinite(partId) || partId <= 0 || !Number.isFinite(chapterId) || chapterId <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid params' })
  }

  const project = await getProjectByAccess(user, projectSlug)
  if (!project) throw createError({ statusCode: 404, statusMessage: 'Project not found' })

  const book = await getBookByProjectIdSlug(project.id, bookSlug)
  if (!book) throw createError({ statusCode: 404, statusMessage: 'Book not found' })

  const partRows = await dbQuery(
    `SELECT id FROM parts WHERE id=? AND book_id=? LIMIT 1`,
    [partId, book.id]
  )
  if (!partRows?.length) throw createError({ statusCode: 404, statusMessage: 'Part not found' })

  try {
    const res = await dbQuery(
      `DELETE FROM chapters WHERE id=? AND part_id=?`,
      [chapterId, partId]
    )
    if (!res?.affectedRows) throw createError({ statusCode: 404, statusMessage: 'Not found' })
    return { ok: true }
  } catch (err) {
    const code = String(err?.code || '')
    if (code === 'ER_ROW_IS_REFERENCED_2' || code === 'ER_ROW_IS_REFERENCED') {
      throw createError({ statusCode: 409, statusMessage: 'Chapter has scenes; delete them first' })
    }
    throw err
  }
})
