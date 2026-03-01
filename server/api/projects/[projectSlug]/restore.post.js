// server/api/projects/[projectSlug]/restore.post.js
import { dbQuery } from '../../../utils/db.js'

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

  const res = await dbQuery(
    `
    UPDATE projects
    SET deleted_at = NULL
    WHERE owner_id=? AND slug=? AND deleted_at IS NOT NULL
    `,
    [userId, projectSlug]
  )

  if (!res?.affectedRows) throw createError({ statusCode: 404, statusMessage: 'Not found' })
  return { ok: true }
})
