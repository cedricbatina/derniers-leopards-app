// server/api/projects/[projectSlug]/scenes/index.get.js
import { dbQuery } from '../../../../utils/db.js'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user?.id) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const bookSlug = String(event.context.params.bookSlug || '').trim()
  if (!bookSlug) throw createError({ statusCode: 400, statusMessage: 'Invalid bookSlug' })

  // Récupère le livre
  const bookRows = await dbQuery('SELECT * FROM books WHERE slug = ?', [bookSlug])
  const book = bookRows[0]
  if (!book) throw createError({ statusCode: 404, statusMessage: 'Book not found' })

  const { q, chapter_id, trashed } = getQuery(event)
  const query = (q ? String(q).trim() : '') || null
  const chapterId = chapter_id ? Number(chapter_id) : null
  if (chapter_id && !Number.isFinite(chapterId)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid chapter_id' })
  }
  const trashedFlag = String(trashed || '') === '1' ? 1 : 0

  const rows = await dbQuery(
    `
    SELECT id, book_id, slug, chapter_id, scene_no, title, pov_character_id, location_id, timeline_event_id, objective, time_of_day, summary, content, conflict, turning_point, outcome, hook, indesign_style, created_at, updated_at, deleted_at
    FROM scenes
    WHERE book_id = ?
      AND (? IS NULL OR chapter_id = ?)
      AND (
        (? = 1 AND deleted_at IS NOT NULL) OR
        (? = 0 AND deleted_at IS NULL)
      )
      AND (
        ? IS NULL
        OR title LIKE CONCAT('%', ?, '%')
        OR slug LIKE CONCAT('%', ?, '%')
        OR summary LIKE CONCAT('%', ?, '%')
      )
    ORDER BY scene_no ASC, id ASC
    LIMIT 500
    `,
    [
      book.id,
      chapterId,
      chapterId,
      trashedFlag,
      trashedFlag,
      query,
      query,
      query,
      query,
    ]
  )

  return { book: { slug: book.slug, id: book.id }, scenes: rows }
})
