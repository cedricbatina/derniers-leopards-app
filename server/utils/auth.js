// server/utils/auth.js
import { setCookie, getCookie } from 'h3'
import { dbQuery } from './db.js'
import { sha256Hex } from './tokens.js'

export function normalizeEmail(email) {
  const e = String(email || '').trim().toLowerCase()
  if (!e || !e.includes('@')) return null
  return e
}

function cookieShouldBeSecure(event) {
  const proto =
    event?.node?.req?.headers?.['x-forwarded-proto'] ||
    (event?.node?.req?.socket?.encrypted ? 'https' : 'http')
  return String(proto).includes('https')
}

export function setAuthCookies(event, { accessToken, refreshToken }) {
  const secure = cookieShouldBeSecure(event)

  setCookie(event, 'access_token', accessToken, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 15, // 15 min
  })

  setCookie(event, 'refresh_token', refreshToken, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 jours
  })
}

export function clearAuthCookies(event) {
  const secure = cookieShouldBeSecure(event)
  setCookie(event, 'access_token', '', { httpOnly: true, secure, sameSite: 'lax', path: '/', maxAge: 0 })
  setCookie(event, 'refresh_token', '', { httpOnly: true, secure, sameSite: 'lax', path: '/', maxAge: 0 })
}

export function readAccessCookie(event) {
  return getCookie(event, 'access_token') || null
}

export function readRefreshCookie(event) {
  return getCookie(event, 'refresh_token') || null
}

export async function findUserByEmail(emailNorm) {
  const rows = await dbQuery(
    `SELECT id, email, password_hash, status, role, email_verified_at
     FROM users
     WHERE email_normalized = ?
       AND deleted_at IS NULL
     LIMIT 1`,
    [emailNorm]
  )
  return rows[0] || null
}

export async function createSession({ userId, refreshToken, userAgent, ip }) {
  const tokenHash = sha256Hex(refreshToken)

  const res = await dbQuery(
    `INSERT INTO user_sessions (user_id, refresh_token_hash, user_agent, ip, expires_at)
     VALUES (?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 30 DAY))`,
    [userId, tokenHash, userAgent || null, ip || null]
  )

  return res?.insertId || null
}
