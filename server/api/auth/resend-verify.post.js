import { defineEventHandler, readBody } from 'h3'
import { dbQuery } from '../../utils/db.js'
import { normalizeEmail } from '../../utils/auth.js'
import { randomToken, sha256Hex } from '../../utils/tokens.js'
import { sendVerifyEmail, detectLocaleFromEvent } from '../../utils/mailer.js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const emailNorm = normalizeEmail(body?.email)

  // Réponse neutre (anti-enum)
  if (!emailNorm) return { ok: true }

  const rows = await dbQuery(
    `SELECT id, email, status, email_verified_at
     FROM users
     WHERE email_normalized=? LIMIT 1`,
    [emailNorm]
  )

  if (!rows.length) return { ok: true }

  const u = rows[0]
  if (u.status === 'active' || u.email_verified_at) return { ok: true }

  await dbQuery(
    `UPDATE auth_tokens
     SET used_at=NOW()
     WHERE user_id=?
       AND token_type='verify_email'
       AND used_at IS NULL
       AND expires_at > NOW()`,
    [u.id]
  )

  const rawToken = randomToken(32)
  const tokenHash = sha256Hex(rawToken)

  await dbQuery(
    `INSERT INTO auth_tokens (user_id, token_type, token_hash, expires_at)
     VALUES (?, 'verify_email', ?, DATE_ADD(NOW(), INTERVAL 2 DAY))`,
    [u.id, tokenHash]
  )

  const locale = detectLocaleFromEvent(event) // fr/en/pt via cookie i18n_redirected ou Accept-Language

  // IMPORTANT: on capture la réponse du mailer
  const mail = await sendVerifyEmail({ email: u.email || emailNorm, token: rawToken, locale })

  // En production vous pouvez retirer mail.messageId.
  // En dev, c’est utile pour prouver l’envoi SMTP.
  return { ok: true, mail: { ok: mail.ok, messageId: mail.messageId || null } }
})
