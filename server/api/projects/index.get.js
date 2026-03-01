// server/api/projects/index.get.js
import { dbQuery } from '../../utils/db.js'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  const userId = user?.id || user?.sub
  console.log('API /api/projects context.user:', user)
  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const { q, trashed } = getQuery(event)
  const query = (q ? String(q).trim() : '') || null
  const trashedFlag = String(trashed || '') === '1' ? 1 : 0

  const rows = await dbQuery(
    `
    SELECT
      id, owner_id,
      slug, public_slug,
      title, title_en, title_pt,
      logline, cover_url,
      status, visibility,
      published_at,
      created_at, updated_at, deleted_at,
      parent_id, type
    FROM projects
    WHERE owner_id = ?
      AND (
        (? = 1 AND deleted_at IS NOT NULL) OR
        (? = 0 AND deleted_at IS NULL)
      )
      AND (
        ? IS NULL
        OR title LIKE CONCAT('%', ?, '%')
        OR slug LIKE CONCAT('%', ?, '%')
        OR public_slug LIKE CONCAT('%', ?, '%')
      )
    ORDER BY updated_at DESC, id DESC
    LIMIT 200
    `,
    [userId, trashedFlag, trashedFlag, query, query, query, query]
  )

  return { projects: rows }
})
