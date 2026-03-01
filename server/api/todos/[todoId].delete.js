// server/api/todos/[todoId].delete.js
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

  const result = await dbQuery(
    'UPDATE todos SET deleted_at = NOW() WHERE id = ? AND user_id = ?',
    [todoId, userId]
  )

  if (!result?.affectedRows) {
    throw createError({ statusCode: 404, statusMessage: 'Todo not found' })
  }

  return { message: 'Todo deleted' }
})
