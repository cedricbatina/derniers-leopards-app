// server/utils/jwt.js
import { createError } from 'h3'
import { useRuntimeConfig } from '#imports'
import { SignJWT, jwtVerify } from 'jose'

const enc = new TextEncoder()

function getSecret(name) {
  const cfg = useRuntimeConfig()
  const v = cfg[name] || process.env[name]
  if (!v) throw createError({ statusCode: 500, statusMessage: `${name} manquant.` })
  return enc.encode(v)
}

export async function signAccessToken({ userId, role }, { expiresIn = '15m' } = {}) {
  return new SignJWT({ role: role || 'user', typ: 'access' })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(String(userId))
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(getSecret('JWT_ACCESS_SECRET'))
}

export async function verifyAccessToken(token) {
  const { payload } = await jwtVerify(token, getSecret('JWT_ACCESS_SECRET'))
  if (payload?.typ !== 'access') throw new Error('Bad token type')
  return payload
}

export async function signRefreshToken({ userId }, { expiresIn = '30d' } = {}) {
  return new SignJWT({ typ: 'refresh' })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(String(userId))
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(getSecret('JWT_REFRESH_SECRET'))
}

export async function verifyRefreshToken(token) {
  const { payload } = await jwtVerify(token, getSecret('JWT_REFRESH_SECRET'))
  if (payload?.typ !== 'refresh') throw new Error('Bad token type')
  return payload
}
