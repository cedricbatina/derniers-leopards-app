// server/api/projects/[slug].delete.js
import { dbQuery } from '../../utils/db.js'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  const userId = Number(user?.id || user?.sub)
  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const projectSlug = String(event.context.params.projectSlug || event.context.params.slug || '').trim()
  if (!projectSlug) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid projectSlug' })
  }

  const res = await dbQuery(
    `
    UPDATE projects
    SET deleted_at = NOW()
    WHERE owner_id=? AND slug=? AND deleted_at IS NULL
    `,
    [userId, projectSlug]
  )

  if (!res?.affectedRows) throw createError({ statusCode: 404, statusMessage: 'Not found' })
  return { ok: true }
})
