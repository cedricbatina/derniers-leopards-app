import crypto from 'crypto'
import argon2 from 'argon2'
import { SignJWT, jwtVerify } from 'jose'
import { setCookie, getCookie } from 'h3'
import { dbQuery } from './db.js'

const enc = new TextEncoder()

export function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase()
}

export async function hashPassword(password) {
  return argon2.hash(password, { type: argon2.argon2id })
}

export async function verifyPassword(hash, password) {
  return argon2.verify(hash, password)
}

export function sha256Hex(input) {
  return crypto.createHash('sha256').update(input).digest('hex')
}

export function randomTokenHex(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex')
}

export async function signAccessToken(payload) {
  const config = useRuntimeConfig()
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(enc.encode(config.JWT_ACCESS_SECRET))
}

export async function signRefreshToken(payload) {
  const config = useRuntimeConfig()
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(enc.encode(config.JWT_REFRESH_SECRET))
}

export async function verifyAccessToken(token) {
  const config = useRuntimeConfig()
  const { payload } = await jwtVerify(token, enc.encode(config.JWT_ACCESS_SECRET))
  return payload
}

export async function verifyRefreshToken(token) {
  const config = useRuntimeConfig()
  const { payload } = await jwtVerify(token, enc.encode(config.JWT_REFRESH_SECRET))
  return payload
}

export function setAuthCookies(event, { accessToken, refreshToken }) {
  const isProd = process.env.NODE_ENV === 'production'

  setCookie(event, 'access_token', accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 15,
  })

  setCookie(event, 'refresh_token', refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/api/auth', // restreint
    maxAge: 60 * 60 * 24 * 30,
  })
}

export function clearAuthCookies(event) {
  const isProd = process.env.NODE_ENV === 'production'
  setCookie(event, 'access_token', '', { httpOnly: true, secure: isProd, sameSite: 'lax', path: '/', maxAge: 0 })
  setCookie(event, 'refresh_token', '', { httpOnly: true, secure: isProd, sameSite: 'lax', path: '/api/auth', maxAge: 0 })
}

export function readAccessCookie(event) {
  return getCookie(event, 'access_token')
}

export function readRefreshCookie(event) {
  return getCookie(event, 'refresh_token')
}

// DB helpers
export async function findUserByEmail(emailNorm) {
  const rows = await dbQuery(
    `SELECT id, email, email_normalized, password_hash, status, role, email_verified_at
     FROM users WHERE email_normalized=? LIMIT 1`,
    [emailNorm]
  )
  return rows[0] || null
}

export async function createSession(userId, refreshToken) {
  const refreshHash = sha256Hex(refreshToken)
  await dbQuery(
    `INSERT INTO user_sessions (user_id, refresh_token_hash, expires_at)
     VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 30 DAY))`,
    [userId, refreshHash]
  )
}
