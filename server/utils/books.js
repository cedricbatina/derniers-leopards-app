import { dbQuery } from './db.js'

export async function getBookByProjectIdSlug(projectId, bookSlug) {
  const rows = await dbQuery(
    `
    SELECT id, project_id, slug, title, deleted_at
    FROM books
    WHERE project_id=? AND slug=?
    LIMIT 1
    `,
    [projectId, bookSlug]
  )
  return rows[0] || null
}
