// server/api/auth/profile.put.js
import { dbQuery } from '../../utils/db.js'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  const userId = user?.id || Number(user?.sub)
  if (!userId) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const body = await readBody(event)

  // Allowed fields for update
  const allowed = ['display_name', 'first_name', 'last_name', 'bio', 'website', 'avatar_url', 'locale', 'timezone']
  const sets = []
  const params = []

  for (const field of allowed) {
    if (body[field] !== undefined) {
      sets.push(`${field} = ?`)
      params.push(body[field] ? String(body[field]).trim() : null)
    }
  }

  if (sets.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No fields to update' })
  }

  params.push(userId)

  await dbQuery(
    `UPDATE users SET ${sets.join(', ')}, updated_at = NOW() WHERE id = ?`,
    params
  )

  const rows = await dbQuery(
    `
    SELECT id, email, display_name, username, status, role,
           account_type, first_name, last_name, organization_name, profession,
           avatar_url, bio, website, email_verified_at, locale, timezone, created_at, updated_at
    FROM users
    WHERE id = ? AND deleted_at IS NULL
    LIMIT 1
    `,
    [userId]
  )

  if (!rows.length) throw createError({ statusCode: 404, statusMessage: 'User not found' })
  return { user: rows[0] }
})
