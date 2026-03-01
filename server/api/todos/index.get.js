// server/api/todos/index.get.js
import { dbQuery } from '../../utils/db.js'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  const userId = Number(user?.id || user?.sub)
  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const { q, status, project_id, completed } = getQuery(event)
  const query = (q ? String(q).trim() : '') || null
  const statusFilter = status ? String(status) : null
  const projectId = project_id ? Number(project_id) : null
  const completedFlag = String(completed || '') === '1' ? 1 : 0

  let sql = `
    SELECT
      t.id, t.user_id, t.project_id, t.character_id, t.scene_id,
      t.title, t.description, t.status, t.priority, t.due_date,
      t.completed_at, t.created_at, t.updated_at,
      p.slug as project_slug, p.title as project_title,
      c.slug as character_slug, c.name as character_name,
      s.slug as scene_slug, s.title as scene_title
    FROM todos t
    LEFT JOIN projects p ON t.project_id = p.id
    LEFT JOIN characters c ON t.character_id = c.id
    LEFT JOIN scenes s ON t.scene_id = s.id
    WHERE t.user_id = ?
      AND t.deleted_at IS NULL
  `

  const params = [userId]

  if (completedFlag === 1) {
    sql += ' AND t.completed_at IS NOT NULL'
  } else {
    sql += ' AND t.completed_at IS NULL'
  }

  if (query) {
    sql += ' AND (t.title LIKE ? OR t.description LIKE ?)'
    params.push(`%${query}%`, `%${query}%`)
  }

  if (statusFilter && ['pending', 'in-progress', 'completed'].includes(statusFilter)) {
    sql += ' AND t.status = ?'
    params.push(statusFilter)
  }

  if (projectId) {
    sql += ' AND t.project_id = ?'
    params.push(projectId)
  }

  sql += ' ORDER BY t.priority DESC, t.due_date ASC, t.created_at DESC LIMIT 500'

  const rows = await dbQuery(sql, params)

  return { todos: rows || [] }
})
