import { defineEventHandler } from 'h3'
import { dbQuery } from '../../utils/db.js'
import { readAccessCookie } from '../../utils/auth.js'
import { verifyAccessToken } from '../../utils/jwt.js'

export default defineEventHandler(async (event) => {
  const token = readAccessCookie(event)
  if (!token) return { user: null }

  try {
    const payload = await verifyAccessToken(token)
    const userId = Number(payload?.sub)
    if (!userId) return { user: null }

    const rows = await dbQuery(
      `SELECT id, email, display_name, username, status, role, email_verified_at, locale, timezone
       FROM users
       WHERE id=? AND deleted_at IS NULL
       LIMIT 1`,
      [userId]
    )

    if (!rows.length) return { user: null }

    const u = rows[0]
    return {
      user: {
        id: u.id,
        email: u.email,
        display_name: u.display_name,
        username: u.username,
        status: u.status,
        role: u.role,
        roles: u.role ? [u.role] : [],
        email_verified_at: u.email_verified_at,
        locale: u.locale,
        timezone: u.timezone,
      },
    }
  } catch {
    return { user: null }
  }
})
