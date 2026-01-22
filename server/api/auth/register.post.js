import { defineEventHandler, readBody, createError } from 'h3'
import { dbQuery } from '../../utils/db.js'
import { normalizeEmail, hashPassword, randomTokenHex, sha256Hex } from '../../utils/auth.js'
import { sendVerifyEmail, detectLocaleFromEvent } from '../../utils/mailer.js'




export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const email = normalizeEmail(body?.email)
  const password = String(body?.password || '')

  if (!email || password.length < 8) {
    throw createError({ statusCode: 400, statusMessage: 'Email ou mot de passe invalide.' })
  }

  const passwordHash = await hashPassword(password)

  // insert user
  await dbQuery(
    `INSERT INTO users (email, email_normalized, password_hash, status)
     VALUES (?, ?, ?, 'pending')
     ON DUPLICATE KEY UPDATE updated_at=NOW()`,
    [email, email, passwordHash]
  )

  const u = (await dbQuery(`SELECT id, status, email_verified_at FROM users WHERE email_normalized=? LIMIT 1`, [email]))[0]
  if (!u) throw createError({ statusCode: 500, statusMessage: 'User creation failed.' })

  // token verify_email (hash only)
  const rawToken = randomTokenHex(32)
  const tokenHash = sha256Hex(rawToken)

  await dbQuery(
    `INSERT INTO auth_tokens (user_id, token_type, token_hash, expires_at)
     VALUES (?, 'verify_email', ?, DATE_ADD(NOW(), INTERVAL 2 DAY))`,
    [u.id, tokenHash]
  )

// ...
const locale = detectLocaleFromEvent(event)
await sendVerifyEmail({ email, token: rawToken, locale })

  await sendVerifyEmail({ email, token: rawToken })
const mailRes = await sendVerifyEmail({ email, token: rawToken })
return { ok: true, mail: mailRes }

  return { ok: true }
})
