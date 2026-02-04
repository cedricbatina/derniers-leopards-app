import { dbQuery } from '../utils/db.js'

export async function getProjectByOwnerSlug(ownerId, projectSlug) {
  const rows = await dbQuery(
    `SELECT id, owner_id, slug, title, status
     FROM projects
     WHERE owner_id=? AND slug=?
     LIMIT 1`,
    [ownerId, projectSlug]
  )
  return rows[0] || null
}
