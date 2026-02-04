// server/utils/auth.js
import { setCookie, getCookie } from 'h3'
import { dbQuery } from './db.js'
import { sha256Hex } from './tokens.js'

/**
 * Normalise un email pour les recherches (email_normalized)
 */
export function normalizeEmail(email) {
  const e = String(email || '').trim().toLowerCase()
  // Validation minimale (on évite de bloquer trop tôt)
  if (!e || !e.includes('@')) return null
  return e
}

/**
 * Détermine si on doit mettre secure=true sur les cookies.
 * - En prod derrière proxy (Vercel), x-forwarded-proto est la source la plus fiable.
 */
function cookieShouldBeSecure(event) {
  const proto =
    event?.node?.req?.headers?.['x-forwarded-proto'] ||
    (event?.node?.req?.socket?.encrypted ? 'https' : 'http')
  return String(proto).includes('https')
}

function cookieBaseOptions(event) {
  return {
    httpOnly: true,
    secure: cookieShouldBeSecure(event),
    sameSite: 'lax',
    path: '/',
  }
}

export function setAuthCookies(event, { accessToken, refreshToken }) {
  const base = cookieBaseOptions(event)

  setCookie(event, 'access_token', accessToken, {
    ...base,
    maxAge: 60 * 15, // 15 min
  })

  setCookie(event, 'refresh_token', refreshToken, {
    ...base,
    maxAge: 60 * 60 * 24 * 30, // 30 jours
  })
}

export function clearAuthCookies(event) {
  const base = cookieBaseOptions(event)

  setCookie(event, 'access_token', '', { ...base, maxAge: 0 })
  setCookie(event, 'refresh_token', '', { ...base, maxAge: 0 })
}

export function readAccessCookie(event) {
  return getCookie(event, 'access_token') || null
}

export function readRefreshCookie(event) {
  return getCookie(event, 'refresh_token') || null
}

/**
 * Helper SQL commun : user + rôles (via user_roles/roles)
 * NOTE:
 * - rolesCsv => "user,editor,admin" (à transformer en array côté API)
 * - fallbackRole => users.role (ancienne logique) si pas de row dans user_roles
 */
async function findUserWithRoles(whereSql, params) {
  const rows = await dbQuery(
    `
    SELECT
      u.id,
      u.email,
      u.email_normalized,
      u.password_hash,
      u.status,
      u.role AS fallback_role,
      u.email_verified_at,
      u.last_login_at,

      -- Profil (nouveaux champs)
      u.account_type,
      u.first_name,
      u.last_name,
      u.display_name,
      u.username,
      u.organization_name,
      u.profession,
      u.avatar_url,
      u.bio,
      u.website,
      u.locale,
      u.timezone,

      -- Rôles multi (si présent)
      GROUP_CONCAT(r.slug ORDER BY r.slug SEPARATOR ',') AS rolesCsv

    FROM users u
    LEFT JOIN user_roles ur ON ur.user_id = u.id
    LEFT JOIN roles r ON r.id = ur.role_id
    WHERE ${whereSql}
      AND u.deleted_at IS NULL
    GROUP BY u.id
    LIMIT 1
    `,
    params
  )

  return rows[0] || null
}

/**
 * Trouve un user par email_normalized, avec rôles.
 */
export async function findUserByEmail(emailNorm) {
  if (!emailNorm) return null
  return findUserWithRoles('u.email_normalized = ?', [emailNorm])
}

/**
 * Trouve un user par id, avec rôles.
 */
export async function findUserById(userId) {
  const id = Number(userId)
  if (!id) return null
  return findUserWithRoles('u.id = ?', [id])
}

/**
 * Crée une session (rotation refresh) dans user_sessions.
 * Table actuelle:
 * - refresh_token_hash (UNIQUE)
 * - revoked_at, replaced_by_session_id...
 */
export async function createSession({ userId, refreshToken, userAgent, ip }) {
  const uid = Number(userId)
  if (!uid || !refreshToken) return null

  const tokenHash = sha256Hex(refreshToken)

  const res = await dbQuery(
    `
    INSERT INTO user_sessions (user_id, refresh_token_hash, user_agent, ip, expires_at)
    VALUES (?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 30 DAY))
    `,
    [uid, tokenHash, userAgent || null, ip || null]
  )

  return res?.insertId || null
}
