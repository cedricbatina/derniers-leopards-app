// server/api/projects/index.get.js
import { dbQuery } from '~~/server/utils/db.js'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  const userId = Number(user?.id || user?.sub)
  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const { q, trashed } = getQuery(event)
  const query = (q ? String(q).trim() : '') || null
  const trashedFlag = String(trashed || '') === '1' ? 1 : 0

  const rows = await dbQuery(
    `
    SELECT
      p.id, p.owner_id,
      p.slug, p.public_slug,
      p.title, p.title_en, p.title_pt,
      p.logline, p.cover_url,
      p.status, p.visibility,
      p.published_at,
      p.created_at, p.updated_at, p.deleted_at,
      p.parent_id, p.type,
      (p.owner_id = ?) AS can_manage,
      CASE
        WHEN p.owner_id = ? THEN 'owner'
        ELSE COALESCE(pm.role, 'viewer')
      END AS access_role
    FROM projects p
    LEFT JOIN project_members pm
      ON pm.project_id = p.id
     AND pm.user_id = ?
     AND pm.deleted_at IS NULL
    WHERE (
        p.owner_id = ?
        OR pm.user_id IS NOT NULL
      )
      AND (
        (? = 1 AND p.deleted_at IS NOT NULL) OR
        (? = 0 AND p.deleted_at IS NULL)
      )
      AND (
        ? IS NULL
        OR p.title LIKE CONCAT('%', ?, '%')
        OR p.slug LIKE CONCAT('%', ?, '%')
        OR p.public_slug LIKE CONCAT('%', ?, '%')
      )
    ORDER BY p.updated_at DESC, p.id DESC
    LIMIT 200
    `,
    [
      userId,
      userId,
      userId,
      userId,
      trashedFlag,
      trashedFlag,
      query,
      query,
      query,
      query,
    ],
  )

  return { projects: rows }
})
