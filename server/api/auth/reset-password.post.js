// server/api/auth/reset-password.post.js
import { defineEventHandler, readBody, createError } from 'h3'
import { dbQuery } from '../../utils/db.js'
import { hashPassword, sha256Hex } from '../../utils/auth.js'

export default defineEventHandler(async (event) => {
  const { token, password } = await readBody(event)

  if (!token || typeof token !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'Token manquant.' })
  }
  if (!password || typeof password !== 'string' || password.length < 8) {
    throw createError({ statusCode: 400, statusMessage: 'Mot de passe trop court (min 8).' })
  }

  const tokenHash = sha256Hex(token)

  const rows = await dbQuery(
    `SELECT t.id AS token_id, t.user_id
     FROM auth_tokens t
     WHERE t.token_type = 'reset_password'
       AND t.token_hash = ?
       AND t.used_at IS NULL
       AND t.expires_at > NOW()
     LIMIT 1`,
    [tokenHash]
  )

  if (!rows.length) {
    throw createError({ statusCode: 400, statusMessage: 'Token invalide ou expiré.' })
  }

  const { token_id, user_id } = rows[0]
  const passwordHash = await hashPassword(password)

  await dbQuery('START TRANSACTION')

  try {
    await dbQuery(
      `UPDATE users
       SET password_hash = ?, updated_at = NOW()
       WHERE id = ?`,
      [passwordHash, user_id]
    )

    await dbQuery(
      `UPDATE auth_tokens
       SET used_at = NOW()
       WHERE id = ?`,
      [token_id]
    )

    // Option sécurité: révoquer sessions actives
    await dbQuery(
      `UPDATE user_sessions
       SET revoked_at = NOW()
       WHERE user_id = ? AND revoked_at IS NULL`,
      [user_id]
    )

    await dbQuery('COMMIT')
  } catch (e) {
    await dbQuery('ROLLBACK')
    throw e
  }

  return { ok: true }
})
