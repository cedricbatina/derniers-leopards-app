// server/api/todos/[todoId].get.js
import { dbQuery } from '../../utils/db.js'

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

  const rows = await dbQuery(
    `
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
    WHERE t.id = ? AND t.user_id = ? AND t.deleted_at IS NULL
    LIMIT 1
    `,
    [todoId, userId]
  )

  if (!rows?.length) {
    throw createError({ statusCode: 404, statusMessage: 'Todo not found' })
  }

  return { todo: rows[0] }
})
