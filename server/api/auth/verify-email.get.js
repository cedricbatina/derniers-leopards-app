import { defineEventHandler, getQuery, createError, getHeader, sendRedirect } from 'h3'
import { dbQuery } from '../../utils/db.js'
import { sha256Hex } from '../../utils/tokens.js'

export default defineEventHandler(async (event) => {
  const { token } = getQuery(event)
  const raw = String(token || '').trim()

  if (!raw) {
    throw createError({ statusCode: 400, message: 'Token manquant.' })
  }

  // Si un navigateur clique l’endpoint API, rediriger vers la page front
  const accept = String(getHeader(event, 'accept') || '')
  if (accept.includes('text/html')) {
    return sendRedirect(event, `/verify-email?token=${encodeURIComponent(raw)}`, 302)
  }

  const tokenHash = sha256Hex(raw)

  // Transaction pour atomicité token + user
  await dbQuery('START TRANSACTION')
  try {
    const rows = await dbQuery(
      `SELECT id, user_id, used_at, expires_at
       FROM auth_tokens
       WHERE token_type = 'verify_email'
         AND token_hash = ?
       LIMIT 1`,
      [tokenHash]
    )

    const t = rows[0]
    if (!t) {
      throw createError({ statusCode: 400, message: 'Token invalide.' })
    }

    if (t.used_at) {
      throw createError({ statusCode: 400, message: 'Token déjà utilisé.' })
    }

    // Expiration
    // MySQL renvoie expires_at en Date/string selon driver: on compare côté SQL pour être safe
    const stillValid = await dbQuery(
      `SELECT id
       FROM auth_tokens
       WHERE id = ?
         AND expires_at > NOW()
         AND used_at IS NULL
       LIMIT 1`,
      [t.id]
    )
    if (!stillValid.length) {
      throw createError({ statusCode: 400, message: 'Token expiré.' })
    }

    await dbQuery(`UPDATE auth_tokens SET used_at = NOW() WHERE id = ?`, [t.id])

    await dbQuery(
      `UPDATE users
       SET email_verified_at = COALESCE(email_verified_at, NOW()),
           status = 'active',
           updated_at = NOW()
       WHERE id = ?`,
      [t.user_id]
    )

    await dbQuery('COMMIT')
    return { ok: true }
  } catch (err) {
    await dbQuery('ROLLBACK')
    throw err?.statusCode ? err : createError({ statusCode: 500, message: 'Erreur serveur (verify-email).' })
  }
})
