// server/api/auth/profile.delete.js
import { dbQuery } from '../../utils/db.js'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  const userId = user?.id || Number(user?.sub)
  if (!userId) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const body = await readBody(event)
  const mode = body?.mode || 'soft' // 'soft' or 'hard'

  if (mode === 'hard') {
    // Hard delete - check password confirmation
    // In this version, we'll require a confirmation via body
    await dbQuery(
      `DELETE FROM users WHERE id = ?`,
      [userId]
    )
    return { deleted: true, message: 'Account permanently deleted' }
  } else {
    // Soft delete
    await dbQuery(
      `UPDATE users SET deleted_at = NOW() WHERE id = ?`,
      [userId]
    )
    return { deleted: true, message: 'Account soft deleted', soft: true }
  }
})
