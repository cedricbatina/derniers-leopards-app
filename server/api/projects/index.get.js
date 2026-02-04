import { dbQuery } from '../../utils/db.js'


export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user?.id) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const { q } = getQuery(event)
  const query = (q ? String(q).trim() : '') || null

  const rows = await dbQuery(
    `
    SELECT id, owner_id, slug, title, title_en, title_pt, logline, status, created_at, updated_at
    FROM projects
    WHERE owner_id = ?
      AND (? IS NULL OR title LIKE CONCAT('%', ?, '%') OR slug LIKE CONCAT('%', ?, '%'))
      
    ORDER BY updated_at DESC, id DESC
    LIMIT 200
    `,
    [user.id, query, query, query]
  )

  return { projects: rows }
})
