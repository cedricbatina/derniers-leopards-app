// server/middleware/auth.global.js
import { defineEventHandler, createError } from 'h3'
import { readAccessCookie } from '../utils/auth.js'
import { verifyAccessToken } from '../utils/jwt.js'

const PUBLIC_PREFIXES = [
  '/api/health',
  '/api/auth/register',
  '/api/auth/login',
  '/api/auth/verify-email',
  '/api/auth/resend-verify',
  '/api/auth/refresh',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
  '/api/auth/me',
  '/api/auth/logout',
]

export default defineEventHandler(async (event) => {
  const url = event.node.req.url || ''

  if (!url.startsWith('/api/')) return
  if (PUBLIC_PREFIXES.some((p) => url.startsWith(p))) return

  const token = readAccessCookie(event)
  if (!token) throw createError({ statusCode: 401, statusMessage: 'Non connecté.' })

  try {
    const payload = await verifyAccessToken(token)
    event.context.user = payload
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Session expirée.' })
  }
})
