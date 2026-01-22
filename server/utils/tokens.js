import { randomBytes, createHash, timingSafeEqual } from 'crypto'

export function randomToken(bytes = 32) {
  return randomBytes(bytes).toString('hex') // 64 chars for 32 bytes
}

export function sha256Hex(input) {
  return createHash('sha256').update(input).digest('hex')
}

export function safeEqualHex(a, b) {
  const ba = Buffer.from(a, 'hex')
  const bb = Buffer.from(b, 'hex')
  if (ba.length !== bb.length) return false
  return timingSafeEqual(ba, bb)
}
