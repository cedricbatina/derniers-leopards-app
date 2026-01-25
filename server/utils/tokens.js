// server/utils/tokens.js
import { randomBytes, createHash, timingSafeEqual } from 'node:crypto'

export function randomToken(bytes = 32) {
  return randomBytes(bytes).toString('hex')
}

// Alias explicite (votre code appelle parfois randomTokenHex)
export function randomTokenHex(bytes = 32) {
  return randomToken(bytes)
}

export function sha256Hex(input) {
  return createHash('sha256').update(String(input)).digest('hex')
}

/**
 * Compare deux hex en timing-safe.
 * Retourne false si longueurs différentes.
 */
export function safeEqualHex(a, b) {
  const ba = Buffer.from(String(a || ''), 'hex')
  const bb = Buffer.from(String(b || ''), 'hex')
  if (ba.length !== bb.length) return false
  return timingSafeEqual(ba, bb)
}
