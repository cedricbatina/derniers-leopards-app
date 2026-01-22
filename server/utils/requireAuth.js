// server/utils/requireAuth.js
import { createError } from 'h3'
import { readAccessCookie, verifyAccessToken } from './auth.js'

export async function requireAuth(event) {
  const token = readAccessCookie(event)
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Non connecté.' })
  }

  try {
    const payload = await verifyAccessToken(token)
    event.context.user = payload
    return payload
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Session expirée.' })
  }
}
