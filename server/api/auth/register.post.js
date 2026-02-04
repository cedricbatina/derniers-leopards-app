// server/api/auth/register.post.js
import { defineEventHandler, readBody, createError } from 'h3'
import { dbQuery } from '../../utils/db.js'
import { normalizeEmail } from '../../utils/auth.js'
import { hashPassword } from '../../utils/password.js'
import { randomTokenHex, sha256Hex } from '../../utils/tokens.js'
import { sendVerifyEmail } from '../../utils/mailer.js'

function badRequest(statusMessage) {
  return createError({ statusCode: 400, statusMessage })
}

function pickString(v, max = 1000) {
  if (v === undefined || v === null) return null
  const s = String(v).trim()
  if (!s) return null
  return s.length > max ? s.slice(0, max) : s
}

function pickEnum(v, allowed, fallback = null) {
  const s = pickString(v, 50)
  if (!s) return fallback
  return allowed.includes(s) ? s : fallback
}

function pickBool(v) {
  if (v === true || v === false) return v
  if (v === 1 || v === 0) return Boolean(v)
  const s = pickString(v, 10)
  if (!s) return null
  if (['1', 'true', 'yes', 'on'].includes(s.toLowerCase())) return true
  if (['0', 'false', 'no', 'off'].includes(s.toLowerCase())) return false
  return null
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const email = normalizeEmail(body?.email)
  const password = String(body?.password || '')

  if (!email) throw badRequest('Email invalide.')
  if (password.length < 8) throw badRequest('Mot de passe trop court (8 caractères minimum).')

  // Profil optionnel
  const accountType = pickEnum(body?.accountType ?? body?.account_type, ['individual', 'pro'], null) // <- null = "si pas fourni, ne pas écraser"
  const firstName = pickString(body?.firstName ?? body?.first_name, 120)
  const lastName = pickString(body?.lastName ?? body?.last_name, 120)
  const displayName = pickString(body?.displayName ?? body?.display_name, 120)
  const username = pickString(body?.username, 64)
  const organizationName = pickString(body?.organizationName ?? body?.organization_name, 180)
  const profession = pickString(body?.profession, 120)
  const avatarUrl = pickString(body?.avatarUrl ?? body?.avatar_url, 512)
  const bio = pickString(body?.bio, 20000)
  const website = pickString(body?.website, 255)
  const locale = pickString(body?.locale, 10)
  const timezone = pickString(body?.timezone, 64)

  const marketingOptIn = pickBool(body?.marketingOptIn ?? body?.marketing_opt_in) // null = ne pas écraser
  const termsAccepted = pickBool(body?.termsAccepted ?? body?.terms_accepted) // true => set NOW() si null

  const passwordHash = await hashPassword(password)

  const rawToken = randomTokenHex(32)
  const tokenHash = sha256Hex(rawToken)

  await dbQuery('START TRANSACTION')

  try {
    // role_id pour "user"
    const roleRows = await dbQuery(`SELECT id FROM roles WHERE slug='user' LIMIT 1`)
    const userRoleId = roleRows[0]?.id
    if (!userRoleId) {
      throw createError({ statusCode: 500, statusMessage: 'Role "user" introuvable (table roles).' })
    }

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

      if (u.status === 'active' || u.email_verified_at) {
        throw createError({ statusCode: 409, statusMessage: 'Email déjà utilisé.' })
      }

      await dbQuery(
        `UPDATE users
         SET
           password_hash = ?,
           account_type = COALESCE(?, account_type),

           first_name = COALESCE(?, first_name),
           last_name = COALESCE(?, last_name),
           display_name = COALESCE(?, display_name),
           username = COALESCE(?, username),

           organization_name = COALESCE(?, organization_name),
           profession = COALESCE(?, profession),

           avatar_url = COALESCE(?, avatar_url),
           bio = COALESCE(?, bio),
           website = COALESCE(?, website),

           locale = COALESCE(?, locale),
           timezone = COALESCE(?, timezone),

           marketing_opt_in = COALESCE(?, marketing_opt_in),

           terms_accepted_at = CASE
             WHEN ? = 1 AND terms_accepted_at IS NULL THEN NOW()
             ELSE terms_accepted_at
           END,

           updated_at = NOW()
         WHERE id = ?`,
        [
          passwordHash,
          accountType,

          firstName,
          lastName,
          displayName,
          username,

          organizationName,
          profession,

          avatarUrl,
          bio,
          website,

          locale,
          timezone,

          marketingOptIn,
          termsAccepted ? 1 : 0,

          u.id,
        ]
      )

      userId = u.id
    } else {
      // Insert user (pending)
      await dbQuery(
        `INSERT INTO users (
          email, email_normalized, password_hash,
          status, role,

          account_type, first_name, last_name, display_name, username,
          organization_name, profession, avatar_url, bio, website,

          marketing_opt_in, terms_accepted_at,
          locale, timezone,

          created_at, updated_at
        ) VALUES (
          ?, ?, ?,
          'pending', 'user',

          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,

          ?, CASE WHEN ? = 1 THEN NOW() ELSE NULL END,
          ?, ?,

          NOW(), NOW()
        )`,
        [
          email,
          email,
          passwordHash,

          accountType || 'individual',
          firstName,
          lastName,
          displayName,
          username,

          organizationName,
          profession,
          avatarUrl,
          bio,
          website,

          marketingOptIn ?? 0,
          termsAccepted ? 1 : 0,

          locale,
          timezone,
        ]
      )

      const idRows = await dbQuery(
        `SELECT id FROM users WHERE email_normalized = ? AND deleted_at IS NULL LIMIT 1`,
        [email]
      )
      userId = idRows[0]?.id || null
    }

    if (!userId) throw createError({ statusCode: 500, statusMessage: 'User creation failed.' })

    // Assigner rôle user via user_roles (idempotent)
    await dbQuery(
      `INSERT IGNORE INTO user_roles (user_id, role_id)
       VALUES (?, ?)`,
      [userId, userRoleId]
    )

    // Invalider anciens tokens verify_email
    await dbQuery(
      `UPDATE auth_tokens
       SET used_at = NOW()
       WHERE user_id = ?
         AND token_type = 'verify_email'
         AND used_at IS NULL
         AND expires_at > NOW()`,
      [userId]
    )

    // Nouveau token verify_email
    await dbQuery(
      `INSERT INTO auth_tokens (user_id, token_type, token_hash, expires_at, created_at)
       VALUES (?, 'verify_email', ?, DATE_ADD(NOW(), INTERVAL 2 DAY), NOW())`,
      [userId, tokenHash]
    )

    await dbQuery('COMMIT')

    await sendVerifyEmail({ email, token: rawToken })
    return { ok: true }
  } catch (err) {
    await dbQuery('ROLLBACK')

    if (err?.code === 'ER_DUP_ENTRY' || err?.errno === 1062) {
      throw createError({ statusCode: 409, statusMessage: 'Email déjà utilisé.' })
    }

    if (err?.statusCode) throw err
    throw createError({ statusCode: 500, statusMessage: 'Erreur serveur (register).' })
  }
})
