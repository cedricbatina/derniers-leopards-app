import { defineEventHandler, readBody, createError } from 'h3'
import { dbQuery } from '../../utils/db.js'
import {
  normalizeEmail, verifyPassword,
  signAccessToken, signRefreshToken,
  setAuthCookies, createSession
} from '../../utils/auth.js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const email = normalizeEmail(body?.email)
  const password = String(body?.password || '')

  const users = await dbQuery(
    `SELECT id, email_normalized, password_hash, status, role
     FROM users WHERE email_normalized=? LIMIT 1`,
    [email]
  )
  const u = users[0]
  if (!u) throw createError({ statusCode: 401, statusMessage: 'Identifiants invalides.' })
  if (u.status !== 'active') throw createError({ statusCode: 403, statusMessage: 'Compte non activé.' })

  const ok = await verifyPassword(u.password_hash, password)
  if (!ok) throw createError({ statusCode: 401, statusMessage: 'Identifiants invalides.' })

  const accessToken = await signAccessToken({ sub: String(u.id), role: u.role })
  const refreshToken = await signRefreshToken({ sub: String(u.id) })

  await createSession(u.id, refreshToken)
  await dbQuery(`UPDATE users SET last_login_at=NOW() WHERE id=?`, [u.id])

  setAuthCookies(event, { accessToken, refreshToken })

  return { ok: true }
})
