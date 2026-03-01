// server/middleware/auth.global.js
import { defineEventHandler, createError, setCookie } from 'h3'
import { dbQuery } from '../utils/db.js'
import { readAccessCookie, readRefreshCookie, clearAuthCookies } from '../utils/auth.js'
import { sha256Hex } from '../utils/tokens.js'
import { verifyAccessToken, verifyRefreshToken, signAccessToken } from '../utils/jwt.js'

// Endpoints API publics
const PUBLIC_PREFIXES = [
  '/api/health',

  // Public read API
  '/api/public',

  // Auth public
  '/api/auth/register',
  '/api/auth/login',
  '/api/auth/verify-email',
  '/api/auth/refresh',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
  '/api/auth/resend-verify',

  // me/logout publics (me: pratique pour front, logout: efface cookies)
  '/api/auth/me',
  '/api/auth/logout',
]

function cookieShouldBeSecure(event) {
  const proto =
    event?.node?.req?.headers?.['x-forwarded-proto'] ||
    (event?.node?.req?.socket?.encrypted ? 'https' : 'http')
  return String(proto).includes('https')
}

function setAccessCookie(event, accessToken) {
  setCookie(event, 'access_token', accessToken, {
    httpOnly: true,
    secure: cookieShouldBeSecure(event),
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 15,
  })
}

async function tryRefreshAccessToken(event) {
  const refreshToken = readRefreshCookie(event)
  if (!refreshToken) return null

  let payload
  try {
    payload = await verifyRefreshToken(refreshToken)
  } catch {
    clearAuthCookies(event)
    return null
  }

  const userId = Number(payload?.sub)
  if (!userId) {
    clearAuthCookies(event)
    return null
  }

  const users = await dbQuery(
    `SELECT id, role, status, email_verified_at
     FROM users
     WHERE id = ?
       AND deleted_at IS NULL
     LIMIT 1`,
    [userId]
  )
  const user = users?.[0]
  if (!user || user.status !== 'active' || !user.email_verified_at) {
    clearAuthCookies(event)
    return null
  }

  const refreshHash = sha256Hex(refreshToken)
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

  if (!sessions?.length) {
    clearAuthCookies(event)
    return null
  }

  const accessToken = await signAccessToken({ userId, role: user.role })
  setAccessCookie(event, accessToken)

  return { id: userId, sub: String(userId), role: user.role, typ: 'access' }
}

export default defineEventHandler(async (event) => {
  const url = event.node.req.url || ''

  // Ne touche que l'API
  if (!url.startsWith('/api/')) return

  // Laisse passer les routes publiques
  if (PUBLIC_PREFIXES.some((p) => url.startsWith(p))) return

  const token = readAccessCookie(event)
  if (!token) {
    const refreshedUser = await tryRefreshAccessToken(event)
    if (refreshedUser) {
      event.context.user = refreshedUser
      return
    }
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  try {
    const payload = await verifyAccessToken(token)
    const userId = Number(payload?.sub)
    if (!userId) {
      throw createError({ statusCode: 401, statusMessage: 'Invalid token subject' })
    }
    event.context.user = {
      ...payload,
      id: userId,
      sub: String(payload?.sub || userId),
    }
  } catch {
    const refreshedUser = await tryRefreshAccessToken(event)
    if (refreshedUser) {
      event.context.user = refreshedUser
      return
    }
    throw createError({ statusCode: 401, statusMessage: 'Session expired' })
  }
})
