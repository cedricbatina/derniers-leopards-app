// server/api/todos/index.post.js
import { dbQuery } from '../../utils/db.js'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  const userId = Number(user?.id || user?.sub)
  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const body = await readBody(event)

  const title = String(body.title || '').trim()
  if (!title) {
    throw createError({ statusCode: 400, statusMessage: 'Title is required' })
  }

  const description = body.description ? String(body.description).trim() : null
  const status = body.status && ['pending', 'in-progress', 'completed'].includes(body.status) 
    ? body.status 
    : 'pending'
  const priority = body.priority && ['low', 'medium', 'high'].includes(body.priority)
    ? body.priority
    : 'medium'
  const dueDate = body.due_date || null
  const projectId = body.project_id ? Number(body.project_id) : null
  const characterId = body.character_id ? Number(body.character_id) : null
  const sceneId = body.scene_id ? Number(body.scene_id) : null

  // Verify project ownership if project_id provided
  if (projectId) {
    const projectRows = await dbQuery(
      'SELECT id FROM projects WHERE id = ? AND owner_id = ? AND deleted_at IS NULL LIMIT 1',
      [projectId, userId]
    )
    if (!projectRows?.length) {
      throw createError({ statusCode: 404, statusMessage: 'Project not found' })
    }
  }

  const result = await dbQuery(
    `
    INSERT INTO todos
    (user_id, project_id, character_id, scene_id, title, description, status, priority, due_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [userId, projectId, characterId, sceneId, title, description, status, priority, dueDate]
  )

  return { todo: { id: result.insertId, title, status, priority } }
})
