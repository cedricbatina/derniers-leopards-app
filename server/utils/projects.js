import { dbQuery } from './db.js'

export async function getProjectByOwnerSlug(ownerId, projectSlug) {
  const rows = await dbQuery(
    `
    SELECT id, owner_id, slug, title, status, deleted_at
    FROM projects
    WHERE owner_id=? AND slug=? AND deleted_at IS NULL
    LIMIT 1
    `,
    [ownerId, projectSlug]
  )
  return rows[0] || null
}
