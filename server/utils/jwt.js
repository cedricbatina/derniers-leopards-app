import { SignJWT, jwtVerify } from 'jose'

function getKey() {
  const { jwtSecret } = useRuntimeConfig()
  if (!jwtSecret) throw createError({ statusCode: 500, statusMessage: 'JWT_SECRET missing' })
  return new TextEncoder().encode(jwtSecret)
}

export async function signAccessToken({ userId, sessionId }, { expiresIn = '15m' } = {}) {
  const cfg = useRuntimeConfig()
  return new SignJWT({ sid: String(sessionId) })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(String(userId))
    .setIssuer(cfg.jwtIssuer)
    .setAudience(cfg.jwtAudience)
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(getKey())
}

export async function verifyAccessToken(token) {
  const cfg = useRuntimeConfig()
  const { payload } = await jwtVerify(token, getKey(), {
    issuer: cfg.jwtIssuer,
    audience: cfg.jwtAudience,
  })
  return payload // { sub, sid, ... }
}
