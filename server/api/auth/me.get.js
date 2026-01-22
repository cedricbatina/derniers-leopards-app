import { defineEventHandler } from 'h3'
import { dbQuery } from '../../utils/db.js'
import { readAccessCookie, verifyAccessToken } from '../../utils/auth.js'

export default defineEventHandler(async (event) => {
  const token = readAccessCookie(event)
  if (!token) return { user: null }

  try {
    const payload = await verifyAccessToken(token)
    const userId = Number(payload.sub)
    const rows = await dbQuery(`SELECT id, email, status, role FROM users WHERE id=? LIMIT 1`, [userId])
    return { user: rows[0] || null }
  } catch {
    return { user: null }
  }
})
