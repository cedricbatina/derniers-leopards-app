import { defineEventHandler, getQuery, createError, getHeader, sendRedirect } from 'h3'
import { dbQuery } from '../../utils/db.js'
import { sha256Hex } from '../../utils/auth.js'

export default defineEventHandler(async (event) => {
  const { token } = getQuery(event)
  const raw = String(token || '')
  if (!raw) throw createError({ statusCode: 400, statusMessage: 'Token manquant.' })

  // Si un navigateur clique un ancien lien /api/auth/verify-email, on renvoie vers la page front
  const accept = String(getHeader(event, 'accept') || '')
  if (accept.includes('text/html')) {
    return sendRedirect(event, `/verify-email?token=${encodeURIComponent(raw)}`, 302)
  }

  const tokenHash = sha256Hex(raw)
  const rows = await dbQuery(
    `SELECT id, user_id, used_at, expires_at
     FROM auth_tokens
     WHERE token_type='verify_email' AND token_hash=? LIMIT 1`,
    [tokenHash]
  )
  const t = rows[0]
  if (!t) throw createError({ statusCode: 400, statusMessage: 'Token invalide.' })
  if (t.used_at) throw createError({ statusCode: 400, statusMessage: 'Token déjà utilisé.' })

  await dbQuery(`UPDATE auth_tokens SET used_at=NOW() WHERE id=?`, [t.id])
  await dbQuery(
    `UPDATE users
     SET email_verified_at=COALESCE(email_verified_at, NOW()),
         status='active'
     WHERE id=?`,
    [t.user_id]
  )

  return { ok: true }
})
