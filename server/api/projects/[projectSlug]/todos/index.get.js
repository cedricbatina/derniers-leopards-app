// server/api/projects/[projectSlug]/todos/index.get.js
import { dbQuery } from '../../../../utils/db.js'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  const userId = Number(user?.id || user?.sub)
  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const projectSlug = String(event.context.params.projectSlug || '').trim()
  if (!projectSlug) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid projectSlug' })
  }

  // Get project
  const projectRows = await dbQuery(
    'SELECT id, slug, title FROM projects WHERE owner_id = ? AND slug = ? AND deleted_at IS NULL LIMIT 1',
    [userId, projectSlug]
  )

  if (!projectRows?.length) {
    throw createError({ statusCode: 404, statusMessage: 'Project not found' })
  }

  const project = projectRows[0]

  const { q, status, completed } = getQuery(event)
  const query = (q ? String(q).trim() : '') || null
  const statusFilter = status ? String(status) : null
  const completedFlag = String(completed || '') === '1' ? 1 : 0

  let sql = `
    SELECT
      t.id, t.user_id, t.project_id, t.character_id, t.scene_id,
      t.title, t.description, t.status, t.priority, t.due_date,
      t.completed_at, t.created_at, t.updated_at,
      c.slug as character_slug, c.name as character_name,
      s.slug as scene_slug, s.title as scene_title
    FROM todos t
    LEFT JOIN characters c ON t.character_id = c.id
    LEFT JOIN scenes s ON t.scene_id = s.id
    WHERE t.user_id = ? AND t.project_id = ?
      AND t.deleted_at IS NULL
  `

  const params = [userId, project.id]

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

  sql += ' ORDER BY t.priority DESC, t.due_date ASC, t.created_at DESC LIMIT 500'

  const rows = await dbQuery(sql, params)

  return { project, todos: rows || [] }
})
