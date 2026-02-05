import { dbQuery } from '../../../../utils/db.js'
import { getProjectByOwnerSlug } from '../../../../utils/projects.js'

async function syncNarrators({ projectId, bookId, narratorIds }) {
  if (narratorIds === null) return

  await dbQuery(`DELETE FROM book_narrators WHERE book_id=?`, [bookId])
  if (!narratorIds.length) return

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

  const values = narratorIds.map(() => '(?, ?)').join(',')
  const params = []
  for (const id of narratorIds) {
    params.push(bookId, id)
  }
  await dbQuery(`INSERT INTO book_narrators (book_id, character_id) VALUES ${values}`, params)
}

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user?.id) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const projectSlug = String(event.context.params.projectSlug || '').trim()
  const bookSlug = String(event.context.params.bookSlug || '').trim()
  if (!projectSlug || !bookSlug) throw createError({ statusCode: 400, statusMessage: 'Invalid params' })

  const project = await getProjectByOwnerSlug(user.id, projectSlug)
  if (!project) throw createError({ statusCode: 404, statusMessage: 'Project not found' })

  const rows = await dbQuery(
    `SELECT id, slug, deleted_at FROM books WHERE project_id=? AND slug=? LIMIT 1`,
    [project.id, bookSlug]
  )
  const existing = rows?.[0]
  if (!existing) throw createError({ statusCode: 404, statusMessage: 'Not found' })

  const body = await readBody(event)

  if (body?.slug && String(body.slug).trim() && String(body.slug).trim() !== bookSlug) {
    throw createError({ statusCode: 400, statusMessage: 'slug is immutable' })
  }

  const title = String(body?.title || '').trim()
  if (!title) throw createError({ statusCode: 400, statusMessage: 'title is required' })

  const subtitle = body?.subtitle !== undefined ? String(body.subtitle || '').trim() : null
  const subtitleEn = body?.subtitle_en !== undefined ? String(body.subtitle_en || '').trim() : null
  const subtitlePt = body?.subtitle_pt !== undefined ? String(body.subtitle_pt || '').trim() : null
  const summary = body?.summary !== undefined ? String(body.summary || '').trim() : null

  const narratorIdsRaw = Array.isArray(body?.narrator_character_ids) ? body.narrator_character_ids : null
  const narratorIds = narratorIdsRaw
    ? [...new Set(narratorIdsRaw.map((x) => Number(x)).filter((n) => Number.isFinite(n) && n > 0))]
    : null

  await dbQuery(
    `
    UPDATE books
    SET title=?, subtitle=?, subtitle_en=?, subtitle_pt=?, summary=?
    WHERE project_id=? AND slug=?
    `,
    [
      title,
      subtitle || null,
      subtitleEn || null,
      subtitlePt || null,
      summary || null,
      project.id,
      bookSlug,
    ]
  )

  await syncNarrators({ projectId: project.id, bookId: existing.id, narratorIds })

  const bookRows = await dbQuery(
    `
    SELECT id, project_id, slug, title, subtitle, subtitle_en, subtitle_pt, summary, created_at, updated_at, deleted_at
    FROM books
    WHERE project_id=? AND slug=?
    LIMIT 1
    `,
    [project.id, bookSlug]
  )

  const narrators = await dbQuery(
    `
    SELECT c.id, c.slug, c.name
    FROM book_narrators bn
    JOIN characters c ON c.id = bn.character_id
    WHERE bn.book_id=?
    ORDER BY c.name ASC, c.id ASC
    `,
    [existing.id]
  )

  return { book: bookRows[0] || null, narrators }
})
