import { defineEventHandler } from 'h3'
import { clearAuthCookies } from '../../utils/auth.js'

export default defineEventHandler(async (event) => {
  clearAuthCookies(event)
  return { ok: true }
})
