// server/api/auth/refresh.post.js
import { defineEventHandler, createError, getHeader } from 'h3'
import { dbQuery } from '../../utils/db.js'
import { readRefreshCookie, setAuthCookies, clearAuthCookies } from '../../utils/auth.js'
import { sha256Hex } from '../../utils/tokens.js'
import { verifyRefreshToken, signAccessToken, signRefreshToken } from '../../utils/jwt.js'

export default defineEventHandler(async (event) => {
  const refreshToken = readRefreshCookie(event)
  if (!refreshToken) throw createError({ statusCode: 401, message: 'No refresh token.' })

  let payload
  try {
    payload = await verifyRefreshToken(refreshToken)
  } catch {
    clearAuthCookies(event)
    throw createError({ statusCode: 401, message: 'Invalid refresh token.' })
  }

  const userId = Number(payload.sub)
  if (!userId) {
    clearAuthCookies(event)
    throw createError({ statusCode: 401, message: 'Invalid token subject.' })
  }

  // Optionnel mais recommandé : user doit toujours exister/être actif
  const users = await dbQuery(
    `SELECT id, role, status, email_verified_at
     FROM users
     WHERE id = ?
       AND deleted_at IS NULL
     LIMIT 1`,
    [userId]
  )
  const u = users[0]
  if (!u || u.status !== 'active' || !u.email_verified_at) {
    clearAuthCookies(event)
    throw createError({ statusCode: 401, message: 'User not active.' })
  }

  const refreshHash = sha256Hex(refreshToken)

  // 1) Vérifie session courante
  const sessions = await dbQuery(
    `SELECT id
     FROM user_sessions
     WHERE user_id = ?
       AND refresh_token_hash = ?
       AND revoked_at IS NULL
       AND expires_at > NOW()
     LIMIT 1`,
    [userId, refreshHash]
  )

  const current = sessions[0]
  if (!current) {
    clearAuthCookies(event)
    throw createError({ statusCode: 401, message: 'Session expired or revoked.' })
  }

  const userAgent = getHeader(event, 'user-agent') || null
  const ip =
    (getHeader(event, 'x-forwarded-for') || '').split(',')[0].trim() ||
    event.node.req.socket?.remoteAddress ||
    null

  // 2) Crée nouvelle session + nouveau refresh
  const newRefresh = await signRefreshToken({ userId })
  const insertRes = await dbQuery(
    `INSERT INTO user_sessions (user_id, refresh_token_hash, user_agent, ip, expires_at)
     VALUES (?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 30 DAY))`,
    [userId, sha256Hex(newRefresh), userAgent, ip]
  )
  const newSessionId = insertRes?.insertId || null

  // 3) Révoque ancienne session + lien de remplacement
  await dbQuery(
    `UPDATE user_sessions
     SET revoked_at = NOW(),
         replaced_by_session_id = ?
     WHERE id = ?`,
    [newSessionId, current.id]
  )

  // 4) Nouveau access token (avec role)
  const accessToken = await signAccessToken({ userId, role: u.role })

  setAuthCookies(event, { accessToken, refreshToken: newRefresh })
  return { ok: true }
})
