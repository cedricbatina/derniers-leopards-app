// server/api/auth/refresh.post.js
import { defineEventHandler, createError } from 'h3'
import { dbQuery } from '../../utils/db.js'
import {
  readRefreshCookie,
  verifyRefreshToken,
  signAccessToken,
  signRefreshToken,
  setAuthCookies,
  clearAuthCookies,
  sha256Hex,
} from '../../utils/auth.js'

export default defineEventHandler(async (event) => {
  const refresh = readRefreshCookie(event)
  if (!refresh) throw createError({ statusCode: 401, statusMessage: 'No refresh token.' })

  let payload
  try {
    payload = verifyRefreshToken(refresh)
  } catch {
    clearAuthCookies(event)
    throw createError({ statusCode: 401, statusMessage: 'Invalid refresh token.' })
  }

  const userId = payload.userId
  const refreshHash = sha256Hex(refresh)

  const sessions = await dbQuery(
    `SELECT id, user_id
     FROM user_sessions
     WHERE user_id = ?
       AND refresh_token_hash = ?
       AND revoked_at IS NULL
       AND expires_at > NOW()
     LIMIT 1`,
    [userId, refreshHash]
  )

  if (!sessions.length) {
    clearAuthCookies(event)
    throw createError({ statusCode: 401, statusMessage: 'Session expired/revoked.' })
  }

  // Rotation (propre)
  const newRefresh = signRefreshToken({ userId })
  const newRefreshHash = sha256Hex(newRefresh)

  const insertRes = await dbQuery(
    `INSERT INTO user_sessions (user_id, refresh_token_hash, expires_at)
     VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 30 DAY))`,
    [userId, newRefreshHash]
  )

  const oldSessionId = sessions[0].id
  await dbQuery(
    `UPDATE user_sessions
     SET revoked_at = NOW()
     WHERE id = ?`,
    [oldSessionId]
  )

  const access = signAccessToken({ userId })
  setAuthCookies(event, { accessToken: access, refreshToken: newRefresh })

  return { ok: true }
})
