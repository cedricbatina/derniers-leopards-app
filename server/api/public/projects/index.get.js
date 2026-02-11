import { dbQuery } from '../../../utils/db.js'

export default defineEventHandler(async (event) => {
  const { q } = getQuery(event)
  const query = (q ? String(q).trim() : '') || null

  const rows = await dbQuery(
    `
    SELECT
      public_slug,
      title, title_en, title_pt,
      logline,
      cover_url,
      published_at
    FROM projects
    WHERE deleted_at IS NULL
      AND status='active'
      AND visibility='public'
      AND public_slug IS NOT NULL
      AND (
        ? IS NULL
        OR title LIKE CONCAT('%', ?, '%')
        OR public_slug LIKE CONCAT('%', ?, '%')
      )
    ORDER BY published_at DESC, id DESC
    LIMIT 200
    `,
    [query, query, query, query]
  )

  return { projects: rows }
})