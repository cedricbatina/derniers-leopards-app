// server/api/auth/login.post.js
import { defineEventHandler, readBody, createError, getHeader } from 'h3'
import { dbQuery } from '../../utils/db.js'
import { normalizeEmail, setAuthCookies, createSession } from '../../utils/auth.js'
import { verifyPassword } from '../../utils/password.js'
import { signAccessToken, signRefreshToken } from '../../utils/jwt.js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const emailNorm = normalizeEmail(body?.email)
  const password = String(body?.password || '')

  if (!emailNorm || !password) {
    throw createError({ statusCode: 400, message: 'Email ou mot de passe invalide.' })
  }

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

  // Flux pro : on exige active ET email vérifié (sinon incohérences)
  if (u.status !== 'active' || !u.email_verified_at) {
    throw createError({ statusCode: 403, message: 'Compte non activé.' })
  }

  const ok = await verifyPassword(u.password_hash, password)
  if (!ok) throw createError({ statusCode: 401, message: 'Identifiants invalides.' })

  const userAgent = getHeader(event, 'user-agent') || null
  const ip =
    (getHeader(event, 'x-forwarded-for') || '').split(',')[0].trim() ||
    event.node.req.socket?.remoteAddress ||
    null

  const refreshToken = await signRefreshToken({ userId: u.id })
  await createSession({ userId: u.id, refreshToken, userAgent, ip })

  const accessToken = await signAccessToken({ userId: u.id, role: u.role })

  setAuthCookies(event, { accessToken, refreshToken })

  await dbQuery(`UPDATE users SET last_login_at=NOW(), updated_at=NOW() WHERE id=?`, [u.id])

  return { ok: true }
})
