// server/middleware/auth.global.js
import { defineEventHandler, createError, getCookie } from 'h3'
import { verifyAccessToken } from '../utils/auth.js'

// Routes API accessibles sans token
const PUBLIC_PREFIXES = [
  '/api/health',

  // Auth public
  '/api/auth/register',
  '/api/auth/login',
  '/api/auth/verify-email',
  '/api/auth/refresh',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',

  // On les laisse publics pour que ton front puisse vérifier l'état
  '/api/auth/me',

  // Logout peut être public: il efface les cookies, point
  '/api/auth/logout',
]

export default defineEventHandler(async (event) => {
  const url = event.node.req.url || ''

  // Ne touche que l'API
  if (!url.startsWith('/api/')) return

  // Laisse passer les endpoints publics
  if (PUBLIC_PREFIXES.some((p) => url.startsWith(p))) return

  const token = getCookie(event, 'access_token')
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Non connecté.' })
  }

  try {
    const payload = await verifyAccessToken(token)
    // dispo dans tes handlers : event.context.user
    event.context.user = payload
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Session expirée.' })
  }
})
