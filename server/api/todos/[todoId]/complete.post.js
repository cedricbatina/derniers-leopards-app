// server/api/todos/[todoId]/complete.post.js
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
    'SELECT id, completed_at FROM todos WHERE id = ? AND user_id = ? AND deleted_at IS NULL LIMIT 1',
    [todoId, userId]
  )

  if (!todoRows?.length) {
    throw createError({ statusCode: 404, statusMessage: 'Todo not found' })
  }

  const todo = todoRows[0]
  const isCompleted = !!todo.completed_at

  // Toggle completion
  if (isCompleted) {
    // Mark as incomplete
    await dbQuery(
      'UPDATE todos SET status = ?, completed_at = NULL, updated_at = NOW() WHERE id = ?',
      ['pending', todoId]
    )
    return { message: 'Todo marked as incomplete', completed: false }
  } else {
    // Mark as complete
    await dbQuery(
      'UPDATE todos SET status = ?, completed_at = NOW(), updated_at = NOW() WHERE id = ?',
      ['completed', todoId]
    )
    return { message: 'Todo marked as complete', completed: true }
  }
})
