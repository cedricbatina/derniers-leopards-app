// server/api/todos/[todoId].put.js
import { dbQuery } from '../../../utils/db.js'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  const userId = Number(user?.id || user?.sub)
  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const todoId = Number(event.context.params.todoId)
  if (!todoId) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid todoId' })
  }

  // Verify ownership
  const todoRows = await dbQuery(
    'SELECT id FROM todos WHERE id = ? AND user_id = ? AND deleted_at IS NULL LIMIT 1',
    [todoId, userId]
  )

  if (!todoRows?.length) {
    throw createError({ statusCode: 404, statusMessage: 'Todo not found' })
  }

  const body = await readBody(event)

  const updates = []
  const params = []

  if (body.title !== undefined && String(body.title).trim()) {
    updates.push('title = ?')
    params.push(String(body.title).trim())
  }

  if (body.description !== undefined) {
    updates.push('description = ?')
    params.push(body.description ? String(body.description).trim() : null)
  }

  if (body.status !== undefined && ['pending', 'in-progress', 'completed'].includes(body.status)) {
    updates.push('status = ?')
    params.push(body.status)
    
    // Auto-set completed_at when status changes to completed
    if (body.status === 'completed') {
      updates.push('completed_at = NOW()')
    } else {
      updates.push('completed_at = NULL')
    }
  }

  if (body.priority !== undefined && ['low', 'medium', 'high'].includes(body.priority)) {
    updates.push('priority = ?')
    params.push(body.priority)
  }

  if (body.due_date !== undefined) {
    updates.push('due_date = ?')
    params.push(body.due_date || null)
  }

  if (body.project_id !== undefined) {
    updates.push('project_id = ?')
    params.push(body.project_id ? Number(body.project_id) : null)
  }

  if (body.character_id !== undefined) {
    updates.push('character_id = ?')
    params.push(body.character_id ? Number(body.character_id) : null)
  }

  if (body.scene_id !== undefined) {
    updates.push('scene_id = ?')
    params.push(body.scene_id ? Number(body.scene_id) : null)
  }

  if (!updates.length) {
    return { message: 'No fields to update' }
  }

  updates.push('updated_at = NOW()')
  params.push(todoId)

  await dbQuery(
    `UPDATE todos SET ${updates.join(', ')} WHERE id = ?`,
    params
  )

  return { message: 'Todo updated' }
})
