import { dbQuery } from '../../../../../../../../utils/db.js'
import { getProjectByOwnerSlug } from '../../../../../../../../utils/projects.js'
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

  const project = await getProjectByOwnerSlug(user.id, projectSlug)
  if (!project) throw createError({ statusCode: 404, statusMessage: 'Project not found' })

  const book = await getBookByProjectIdSlug(project.id, bookSlug)
  if (!book) throw createError({ statusCode: 404, statusMessage: 'Book not found' })

  const partRows = await dbQuery(
    `SELECT id FROM parts WHERE id=? AND book_id=? LIMIT 1`,
    [partId, book.id]
  )
  if (!partRows?.length) throw createError({ statusCode: 404, statusMessage: 'Part not found' })

  const rows = await dbQuery(
    `
    SELECT *
    FROM chapters
    WHERE id=? AND part_id=?
    LIMIT 1
    `,
    [chapterId, partId]
  )

  if (!rows?.length) throw createError({ statusCode: 404, statusMessage: 'Not found' })

  return { chapter: rows[0] }
})
