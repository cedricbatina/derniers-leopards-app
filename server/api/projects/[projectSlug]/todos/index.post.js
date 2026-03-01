// server/api/projects/[projectSlug]/todos/index.post.js
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

  // Get and verify project
  const projectRows = await dbQuery(
    'SELECT id FROM projects WHERE owner_id = ? AND slug = ? AND deleted_at IS NULL LIMIT 1',
    [userId, projectSlug]
  )

  if (!projectRows?.length) {
    throw createError({ statusCode: 404, statusMessage: 'Project not found' })
  }

  const project = projectRows[0]

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
  const characterId = body.character_id ? Number(body.character_id) : null
  const sceneId = body.scene_id ? Number(body.scene_id) : null

  const result = await dbQuery(
    `
    INSERT INTO todos
    (user_id, project_id, character_id, scene_id, title, description, status, priority, due_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [userId, project.id, characterId, sceneId, title, description, status, priority, dueDate]
  )

  return { todo: { id: result.insertId, title, status, priority } }
})
