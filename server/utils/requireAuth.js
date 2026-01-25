// server/utils/requireAuth.js
import { createError } from 'h3'
import { readAccessCookie } from './auth.js'
import { verifyAccessToken } from './jwt.js'

export async function requireAuth(event) {
  const token = readAccessCookie(event)
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  try {
    const payload = await verifyAccessToken(token)
    event.context.auth = payload
    return payload
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
}
