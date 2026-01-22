// server/api/auth/forgot-password.post.js
import { defineEventHandler, readBody } from 'h3'
import { dbQuery } from '../../utils/db.js'
import { normalizeEmail, sha256Hex } from '../../utils/auth.js'
import { sendResetPasswordEmail } from '../../utils/mailer.js'
import crypto from 'crypto'

function randomToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex')
}

export default defineEventHandler(async (event) => {
  const { email } = await readBody(event)
  const emailNorm = normalizeEmail(email || '')

  // Réponse neutre (anti-enum)
  if (!emailNorm) return { ok: true }

  const users = await dbQuery(
    `SELECT id, email, email_verified_at, status
     FROM users
     WHERE email_normalized = ?
     LIMIT 1`,
    [emailNorm]
  )

  if (!users.length) return { ok: true }

  const user = users[0]
  if (user.status !== 'active') return { ok: true }

  // Option: si tu veux exiger email vérifié
  // if (!user.email_verified_at) return { ok: true }

  const raw = randomToken(32)
  const tokenHash = sha256Hex(raw)

  await dbQuery(
    `INSERT INTO auth_tokens (user_id, token_type, token_hash, expires_at)
     VALUES (?, 'reset_password', ?, DATE_ADD(NOW(), INTERVAL 1 HOUR))`,
    [user.id, tokenHash]
  )

  await sendResetPasswordEmail({ email: user.email, token: raw })
  return { ok: true }
})
