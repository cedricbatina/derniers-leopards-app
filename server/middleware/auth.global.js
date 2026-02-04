// server/middleware/auth.global.js
import { defineEventHandler, createError, getCookie } from 'h3'
import { verifyAccessToken } from '../utils/jwt.js'

// Endpoints API publics
const PUBLIC_PREFIXES = [
  '/api/health',

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

export default defineEventHandler(async (event) => {
  const url = event.node.req.url || ''

  // Ne touche que l'API
  if (!url.startsWith('/api/')) return

  // Laisse passer les routes publiques
  if (PUBLIC_PREFIXES.some((p) => url.startsWith(p))) return

  const token = getCookie(event, 'access_token')
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  try {
    const payload = await verifyAccessToken(token)
    event.context.user = payload
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Session expired' })
  }
})
