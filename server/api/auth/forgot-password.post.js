// server/api/auth/forgot-password.post.js
import { defineEventHandler, readBody } from 'h3'
import { dbQuery } from '../../utils/db.js'
import { normalizeEmail } from '../../utils/auth.js'
import { randomTokenHex, sha256Hex } from '../../utils/tokens.js'
import { sendResetPasswordEmail } from '../../utils/mailer.js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const emailNorm = normalizeEmail(body?.email)

  // Réponse neutre (anti-enum)
  if (!emailNorm) return { ok: true }

  const users = await dbQuery(
    `SELECT id, email, email_verified_at, status
     FROM users
     WHERE email_normalized = ?
       AND deleted_at IS NULL
     LIMIT 1`,
    [emailNorm]
  )

  if (!users.length) return { ok: true }

  const user = users[0]
  if (user.status !== 'active') return { ok: true }
  // Option stricte:
  // if (!user.email_verified_at) return { ok: true }

  // Invalider les anciens tokens reset encore valides (évite confusion)
  await dbQuery(
    `UPDATE auth_tokens
     SET used_at = NOW()
     WHERE user_id = ?
       AND token_type = 'reset_password'
       AND used_at IS NULL
       AND expires_at > NOW()`,
    [user.id]
  )

  const rawToken = randomTokenHex(32)
  const tokenHash = sha256Hex(rawToken)

  await dbQuery(
    `INSERT INTO auth_tokens (user_id, token_type, token_hash, expires_at)
     VALUES (?, 'reset_password', ?, DATE_ADD(NOW(), INTERVAL 1 HOUR))`,
    [user.id, tokenHash]
  )

  await sendResetPasswordEmail({ email: user.email, token: rawToken })
  return { ok: true }
})
