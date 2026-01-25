// server/api/auth/reset-password.post.js
import { defineEventHandler, readBody, createError } from 'h3'
import { dbQuery } from '../../utils/db.js'
import { hashPassword } from '../../utils/password.js'
import { sha256Hex } from '../../utils/tokens.js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const token = body?.token
  const password = body?.password

  if (!token || typeof token !== 'string') {
    throw createError({ statusCode: 400, message: 'Token manquant.' })
  }
  if (!password || typeof password !== 'string' || password.length < 8) {
    throw createError({ statusCode: 400, message: 'Mot de passe trop court (min 8).' })
  }

  const tokenHash = sha256Hex(token)

  await dbQuery('START TRANSACTION')
  try {
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
      throw createError({ statusCode: 400, message: 'Token invalide ou expiré.' })
    }

    const { token_id, user_id } = rows[0]
    const passwordHash = await hashPassword(password)

    await dbQuery(
      `UPDATE users
       SET password_hash = ?, password_changed_at = NOW(), updated_at = NOW()
       WHERE id = ?`,
      [passwordHash, user_id]
    )

    await dbQuery(
      `UPDATE auth_tokens
       SET used_at = NOW()
       WHERE id = ?`,
      [token_id]
    )

    // Sécurité: révoquer sessions actives
    await dbQuery(
      `UPDATE user_sessions
       SET revoked_at = NOW()
       WHERE user_id = ? AND revoked_at IS NULL`,
      [user_id]
    )

    await dbQuery('COMMIT')
    return { ok: true }
  } catch (e) {
    await dbQuery('ROLLBACK')
    throw e
  }
})
