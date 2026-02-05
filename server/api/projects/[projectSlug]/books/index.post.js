import { dbQuery } from '../../../../utils/db.js'
import { getProjectByOwnerSlug } from '../../../../utils/projects.js'

function toSlug(input) {
  return String(input || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

async function syncNarrators({ projectId, bookId, narratorIds }) {
  // narratorIds can be null (meaning "don't touch"), [] (meaning "clear")
  if (narratorIds === null) return

  // clear first
  await dbQuery(`DELETE FROM book_narrators WHERE book_id=?`, [bookId])

  if (!narratorIds.length) return

  // validate that all characters belong to project
  const placeholders = narratorIds.map(() => '?').join(',')
  const rows = await dbQuery(
    `SELECT id FROM characters WHERE project_id=? AND id IN (${placeholders})`,
    [projectId, ...narratorIds]
  )
  const found = new Set((rows || []).map((r) => Number(r.id)))
  for (const id of narratorIds) {
    if (!found.has(Number(id))) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid narrator_character_ids' })
    }
  }

  // insert
  const values = narratorIds.map(() => '(?, ?)').join(',')
  const params = []
  for (const id of narratorIds) {
    params.push(bookId, id)
  }
  await dbQuery(
    `INSERT INTO book_narrators (book_id, character_id) VALUES ${values}`,
    params
  )
}

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user?.id) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const projectSlug = String(event.context.params.projectSlug || '').trim()
  if (!projectSlug) throw createError({ statusCode: 400, statusMessage: 'Invalid projectSlug' })

  const project = await getProjectByOwnerSlug(user.id, projectSlug)
  if (!project) throw createError({ statusCode: 404, statusMessage: 'Project not found' })

  const body = await readBody(event)

  const title = String(body?.title || '').trim()
  if (!title) throw createError({ statusCode: 400, statusMessage: 'title is required' })

  const slug = toSlug(body?.slug || title) || `book-${Date.now()}`

  const subtitle = body?.subtitle !== undefined ? String(body.subtitle || '').trim() : null
  const subtitleEn = body?.subtitle_en !== undefined ? String(body.subtitle_en || '').trim() : null
  const subtitlePt = body?.subtitle_pt !== undefined ? String(body.subtitle_pt || '').trim() : null
  const summary = body?.summary !== undefined ? String(body.summary || '').trim() : null

  const narratorIdsRaw = Array.isArray(body?.narrator_character_ids) ? body.narrator_character_ids : null
  const narratorIds = narratorIdsRaw
    ? [...new Set(narratorIdsRaw.map((x) => Number(x)).filter((n) => Number.isFinite(n) && n > 0))]
    : null

  try {
    await dbQuery(
      `
      INSERT INTO books (project_id, slug, title, subtitle, subtitle_en, subtitle_pt, summary)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        project.id,
        slug,
        title,
        subtitle || null,
        subtitleEn || null,
        subtitlePt || null,
        summary || null,
      ]
    )
  } catch (err) {
    if (String(err?.code) === 'ER_DUP_ENTRY') {
      throw createError({ statusCode: 409, statusMessage: 'Book slug already exists in this project' })
    }
    throw err
  }

  const rows = await dbQuery(
    `
    SELECT id, project_id, slug, title, subtitle, subtitle_en, subtitle_pt, summary, created_at, updated_at, deleted_at
    FROM books
    WHERE project_id=? AND slug=?
    LIMIT 1
    `,
    [project.id, slug]
  )

  const book = rows?.[0] || null
  if (!book) throw createError({ statusCode: 500, statusMessage: 'Insert failed' })

  await syncNarrators({ projectId: project.id, bookId: book.id, narratorIds })

  const narrators = await dbQuery(
    `
    SELECT c.id, c.slug, c.name
    FROM book_narrators bn
    JOIN characters c ON c.id = bn.character_id
    WHERE bn.book_id=?
    ORDER BY c.name ASC, c.id ASC
    `,
    [book.id]
  )

  return { book, narrators }
})
