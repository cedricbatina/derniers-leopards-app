import { defineEventHandler, readBody, createError } from 'h3'
import { dbQuery } from '../../utils/db.js'
import { normalizeEmail } from '../../utils/auth.js'
import { hashPassword } from '../../utils/password.js'
import { randomTokenHex, sha256Hex } from '../../utils/tokens.js'
import { sendVerifyEmail } from '../../utils/mailer.js'

function badRequest(message) {
  return createError({ statusCode: 400, message })
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const email = normalizeEmail(body?.email)
  const password = String(body?.password || '')

  if (!email) throw badRequest('Email invalide.')
  if (password.length < 8) throw badRequest('Mot de passe trop court (8 caractères minimum).')

  // Hash password (argon2) avant transaction OK
  const passwordHash = await hashPassword(password)

  // Token brut + hash (DB)
  const rawToken = randomTokenHex(32)
  const tokenHash = sha256Hex(rawToken)

  // Transaction: users + auth_tokens atomiques
  await dbQuery('START TRANSACTION')

  try {
    // 1) Cherche user existant (email_normalized)
    const existingRows = await dbQuery(
      `SELECT id, status, email_verified_at
       FROM users
       WHERE email_normalized = ?
         AND deleted_at IS NULL
       LIMIT 1`,
      [email]
    )

    let userId = null

    if (existingRows.length) {
      const u = existingRows[0]

      // Déjà actif / déjà vérifié => conflit
      if (u.status === 'active' || u.email_verified_at) {
        throw createError({ statusCode: 409, message: 'Email déjà utilisé.' })
      }

      // pending: on met à jour le password_hash (permet de “réessayer” l’inscription)
      await dbQuery(
        `UPDATE users
         SET password_hash = ?, updated_at = NOW()
         WHERE id = ?`,
        [passwordHash, u.id]
      )

      userId = u.id
    } else {
      // 2) Création user (pending)
      // IMPORTANT: si votre table a des champs NOT NULL additionnels, ajoutez-les ici.
      const res = await dbQuery(
        `INSERT INTO users (email, email_normalized, password_hash, status, created_at, updated_at)
         VALUES (?, ?, ?, 'pending', NOW(), NOW())`,
        [email, email, passwordHash]
      )

      userId = res?.insertId || null
    }

    if (!userId) {
      throw createError({ statusCode: 500, message: 'User creation failed.' })
    }

    // 3) Invalider les tokens verify_email précédents encore valides
    await dbQuery(
      `UPDATE auth_tokens
       SET used_at = NOW()
       WHERE user_id = ?
         AND token_type = 'verify_email'
         AND used_at IS NULL
         AND expires_at > NOW()`,
      [userId]
    )

    // 4) Nouveau token verify_email
    await dbQuery(
      `INSERT INTO auth_tokens (user_id, token_type, token_hash, expires_at, created_at)
       VALUES (?, 'verify_email', ?, DATE_ADD(NOW(), INTERVAL 2 DAY), NOW())`,
      [userId, tokenHash]
    )

    await dbQuery('COMMIT')

    // 5) Envoi email après COMMIT (sinon: token DB peut ne pas exister si rollback)
    await sendVerifyEmail({ email, token: rawToken })

    return { ok: true }
  } catch (err) {
    await dbQuery('ROLLBACK')

    // Cas particulier: collision unique (si vous avez UNIQUE sur email_normalized)
    // MySQL: ER_DUP_ENTRY (1062)
    if (err?.code === 'ER_DUP_ENTRY' || err?.errno === 1062) {
      throw createError({ statusCode: 409, message: 'Email déjà utilisé.' })
    }

    // Si c’est déjà une createError, renvoyer telle quelle
    if (err?.statusCode) throw err

    throw createError({ statusCode: 500, message: 'Erreur serveur (register).' })
  }
})
