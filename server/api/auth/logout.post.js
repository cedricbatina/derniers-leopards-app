// server/api/auth/logout.post.js
import { defineEventHandler } from 'h3'
import { dbQuery } from '~~/server/utils/db.js'
import { readRefreshCookie, clearAuthCookies } from '~~/server/utils/auth.js'
import { sha256Hex } from '~~/server/utils/tokens.js'

export default defineEventHandler(async (event) => {
  const refreshToken = readRefreshCookie(event)

  if (refreshToken) {
    const hash = sha256Hex(refreshToken)
    await dbQuery(
      `UPDATE user_sessions
       SET revoked_at = NOW()
       WHERE refresh_token_hash = ?
         AND revoked_at IS NULL`,
      [hash]
    )
  }

  clearAuthCookies(event)
  return { ok: true }
})
