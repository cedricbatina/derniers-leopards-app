import { dbQuery } from '../../../../../../utils/db.js'
import { getProjectByAccess } from '../../../../../../utils/projects.js'
import { getBookByProjectIdSlug } from '../../../../../../utils/books.js'

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

  const projectSlug = String(event.context.params.projectSlug || '').trim()
  const bookSlug = String(event.context.params.bookSlug || '').trim()
  if (!projectSlug || !bookSlug) throw createError({ statusCode: 400, statusMessage: 'Invalid params' })

  const project = await getProjectByAccess(user, projectSlug)
  if (!project) throw createError({ statusCode: 404, statusMessage: 'Project not found' })

  const book = await getBookByProjectIdSlug(project.id, bookSlug)
  if (!book) throw createError({ statusCode: 404, statusMessage: 'Book not found' })

  const body = await readBody(event)

  const title = String(body?.title || '').trim()
  if (!title) throw createError({ statusCode: 400, statusMessage: 'title is required' })

  let partNo = body?.part_no !== undefined ? Number(body.part_no) : null
  if (partNo !== null && (!Number.isFinite(partNo) || partNo <= 0)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid part_no' })
  }
  if (!partNo) {
    const maxRows = await dbQuery(
      `SELECT COALESCE(MAX(part_no), 0) AS m FROM parts WHERE book_id=?`,
      [book.id]
    )
    partNo = Number(maxRows?.[0]?.m || 0) + 1
  }

  const slug = toSlug(body?.slug || title || `part-${partNo}`) || `part-${Date.now()}`
  const summary = body?.summary !== undefined ? String(body.summary || '').trim() : null

  try {
    await dbQuery(
      `
      INSERT INTO parts (book_id, slug, part_no, title, summary)
      VALUES (?, ?, ?, ?, ?)
      `,
      [book.id, slug, partNo, title, summary || null]
    )
  } catch (err) {
    if (String(err?.code) === 'ER_DUP_ENTRY') {
      throw createError({ statusCode: 409, statusMessage: 'Part slug already exists in this book' })
    }
    throw err
  }

  const rows = await dbQuery(
    `
    SELECT id, book_id, slug, part_no, title, summary, created_at, updated_at
    FROM parts
    WHERE book_id=? AND slug=?
    LIMIT 1
    `,
    [book.id, slug]
  )

  return { part: rows?.[0] || null }
})
