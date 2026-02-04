// server/api/auth/me.get.js
import { defineEventHandler } from 'h3'
import { dbQuery } from '../../utils/db.js'
import { readAccessCookie, clearAuthCookies } from '../../utils/auth.js'
import { verifyAccessToken } from '../../utils/jwt.js'

export default defineEventHandler(async (event) => {
  const token = readAccessCookie(event)
  if (!token) return { user: null }

  try {
    const payload = await verifyAccessToken(token)
    const userId = Number(payload?.sub)
    if (!userId) return { user: null }

    // 1) User
    const rows = await dbQuery(
      `SELECT
         id, email,
         display_name, username,
         status, role,
         account_type, first_name, last_name, organization_name, profession,
         avatar_url, bio, website,
         email_verified_at, locale, timezone
       FROM users
       WHERE id = ? AND deleted_at IS NULL
       LIMIT 1`,
      [userId]
    )

    if (!rows.length) return { user: null }
    const u = rows[0]

    // 2) Roles (source de vérité)
    const roleRows = await dbQuery(
      `SELECT r.slug
       FROM user_roles ur
       JOIN roles r ON r.id = ur.role_id
       WHERE ur.user_id = ?
       ORDER BY ur.assigned_at ASC`,
      [userId]
    )

    let roles = roleRows.map((r) => r.slug).filter(Boolean)

    // Fallback legacy: users.role (enum) si user_roles est vide
    if (!roles.length && u.role) roles = [u.role]

    const primaryRole =
      roles.includes('admin') ? 'admin'
      : roles.includes('editor') ? 'editor'
      : roles[0] || 'user'

    return {
      user: {
        id: u.id,
        email: u.email,

        display_name: u.display_name,
        username: u.username,

        status: u.status,
        email_verified_at: u.email_verified_at,

        account_type: u.account_type,
        first_name: u.first_name,
        last_name: u.last_name,
        organization_name: u.organization_name,
        profession: u.profession,
        avatar_url: u.avatar_url,
        bio: u.bio,
        website: u.website,

        locale: u.locale,
        timezone: u.timezone,

        // RBAC
        primary_role: primaryRole, // <- plus clair
        roles,
      },
    }
  } catch {
    // token invalide/expiré => on nettoie (sinon “fausse session” côté client)
    clearAuthCookies(event)
    return { user: null }
  }
})
