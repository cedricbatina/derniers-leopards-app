// server/api/auth/login.post.js
import { defineEventHandler, readBody, createError, getHeader } from 'h3'
import { dbQuery } from '../../utils/db.js'
import { normalizeEmail, setAuthCookies, createSession } from '../../utils/auth.js'
import { verifyPassword } from '../../utils/password.js'
import { signAccessToken, signRefreshToken } from '../../utils/jwt.js'

function pickPrimaryRole(slugs = [], fallback = 'user') {
  if (slugs.includes('admin')) return 'admin'
  if (slugs.includes('editor')) return 'editor'
  if (slugs.includes('user')) return 'user'
  return fallback || 'user'
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const emailNorm = normalizeEmail(body?.email)
  const password = String(body?.password || '')

  if (!emailNorm || !password) {
    throw createError({ statusCode: 400, message: 'Email ou mot de passe invalide.' })
  }

  // 1) User
  const rows = await dbQuery(
    `SELECT id, email, password_hash, status, role, email_verified_at
     FROM users
     WHERE email_normalized = ?
       AND deleted_at IS NULL
     LIMIT 1`,
    [emailNorm]
  )

  const u = rows[0]
  if (!u) throw createError({ statusCode: 401, message: 'Identifiants invalides.' })

  // Flux pro : exige active + email vérifié
  if (u.status !== 'active' || !u.email_verified_at) {
    throw createError({ statusCode: 403, message: 'Compte non activé.' })
  }

  // 2) Password
  const ok = await verifyPassword(u.password_hash, password)
  if (!ok) throw createError({ statusCode: 401, message: 'Identifiants invalides.' })

  // 3) Roles via user_roles (source de vérité)
  const roleRows = await dbQuery(
    `SELECT r.slug
     FROM user_roles ur
     JOIN roles r ON r.id = ur.role_id
     WHERE ur.user_id = ?`,
    [u.id]
  )
  const roles = roleRows.map((r) => r.slug).filter(Boolean)

  // Fallback legacy si jamais user_roles est vide (transition)
  const mergedRoles = roles.length ? roles : (u.role ? [u.role] : ['user'])
  const primaryRole = pickPrimaryRole(mergedRoles, u.role || 'user')

  // 4) Session + tokens
  const userAgent = getHeader(event, 'user-agent') || null
  const ip =
    (getHeader(event, 'x-forwarded-for') || '').split(',')[0].trim() ||
    event.node.req.socket?.remoteAddress ||
    null

  const refreshToken = await signRefreshToken({ userId: u.id })
  await createSession({ userId: u.id, refreshToken, userAgent, ip })

  // On garde "role" dans l'access token pour compat (middleware/ACL éventuels)
  const accessToken = await signAccessToken({ userId: u.id, role: primaryRole })

  setAuthCookies(event, { accessToken, refreshToken })

  await dbQuery(
    `UPDATE users
     SET last_login_at = NOW(),
         updated_at = NOW()
     WHERE id = ?`,
    [u.id]
  )

  return { ok: true }
})
