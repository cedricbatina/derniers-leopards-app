// server/utils/mailer.js
import nodemailer from 'nodemailer'
import { createError, getHeader, parseCookies } from 'h3'
import { useRuntimeConfig } from '#imports'

// IMPORTANT: ajuste le chemin si besoin (root/locales/*.json)
import frMessages from '../../i18n/locales/fr.json'
import enMessages from '../../i18n/locales/en.json'

let _transporter = null
let _smtpVerified = false

function getAppUrl(config) {
  return (
    process.env.APP_URL ||
    config.public?.APP_URL ||
    config.APP_URL ||
    'http://localhost:3009'
  ).replace(/\/$/, '')
}

/**
 * i18n minimal côté server, basé sur vos JSON.
 * On lit uniquement les clés nécessaires pour les emails.
 */
function deepGet(obj, path) {
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj)
}

function interpolate(str, vars = {}) {
  return String(str).replace(/\{\{(\w+)\}\}/g, (_, k) => (vars[k] ?? ''))
}

function getEmailMessages(locale) {
  const code = String(locale || '').toLowerCase()
  if (code.startsWith('en')) return enMessages
  return frMessages
}

function tEmail(locale, key, fallback, vars) {
  const messages = getEmailMessages(locale)
  const raw = deepGet(messages, key)
  const val = raw === undefined ? fallback : raw
  return interpolate(val, vars)
}

/**
 * Détection locale (si vous la passez pas explicitement).
 * - cookie i18n_redirected (Nuxt i18n)
 * - sinon Accept-Language
 * fallback fr
 */
export function detectLocaleFromEvent(event) {
  const cookies = parseCookies(event)
  const c = cookies?.i18n_redirected
  if (c && typeof c === 'string') return c

  const al = String(getHeader(event, 'accept-language') || '').trim()
  const code = al.split(',')[0]?.trim()?.slice(0, 2).toLowerCase()
  return code === 'en' ? 'en' : 'fr'
}

function getSmtpRuntimeConfig() {
  const config = useRuntimeConfig()
  const host = process.env.SMTP_HOST || config.SMTP_HOST
  const portRaw = process.env.SMTP_PORT || config.SMTP_PORT
  const port = Number(portRaw || 587)
  const user = process.env.SMTP_USER || config.SMTP_USER
  const pass = process.env.SMTP_PASS || config.SMTP_PASS
  return { host, port, user, pass }
}

function getFromRuntimeConfig() {
  const config = useRuntimeConfig()
  const fromEmail = process.env.EMAIL_FROM || config.EMAIL_FROM
  const fromName = process.env.EMAIL_FROM_NAME || config.EMAIL_FROM_NAME || 'Les derniers léopards'
  return { fromEmail, fromName }
}

function assertSmtpConfigured({ host, port, user, pass }) {
  const missing = []
  if (!host) missing.push('SMTP_HOST')
  if (!port) missing.push('SMTP_PORT')
  if (!user) missing.push('SMTP_USER')
  if (!pass) missing.push('SMTP_PASS')

  if (missing.length) {
    throw createError({
      statusCode: 500,
      message: `SMTP non configuré: variable(s) manquante(s) ${missing.join(', ')}`,
    })
  }
}

function assertFromConfigured({ fromEmail }) {
  if (!fromEmail) {
    throw createError({ statusCode: 500, message: 'EMAIL_FROM manquant (runtimeConfig).' })
  }
}

async function getTransporter() {
  if (_transporter) return _transporter

  const smtp = getSmtpRuntimeConfig()
  assertSmtpConfigured(smtp)

  const secure = smtp.port === 465
  _transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure,
    auth: { user: smtp.user, pass: smtp.pass },
    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    socketTimeout: 20_000,
  })

  try {
    await _transporter.verify()
    _smtpVerified = true
    console.log('[MAIL] SMTP ready', { host: smtp.host, port: smtp.port, secure })
  } catch (err) {
    _transporter = null
    throw createError({
      statusCode: 502,
      message: `SMTP verify failed: ${err?.message || 'unknown error'}`,
    })
  }

  return _transporter
}

/**
 * sendEmail({ toEmail, toName, subject, html, text })
 */
export async function sendEmail({ toEmail, toName, subject, html, text }) {
  const from = getFromRuntimeConfig()
  assertFromConfigured(from)

  if (!toEmail) throw createError({ statusCode: 400, message: 'toEmail manquant.' })
  if (!subject) throw createError({ statusCode: 400, message: 'subject manquant.' })
  if (!html && !text) {
    throw createError({ statusCode: 400, message: 'Contenu email manquant (html ou text).' })
  }

  const transporter = await getTransporter()

  try {
    const info = await transporter.sendMail({
      from: { name: from.fromName, address: from.fromEmail },
      to: [{ name: toName || toEmail, address: toEmail }],
      subject,
      text: text || undefined,
      html: html || undefined,
    })

    console.log('[MAIL] Sent', {
      to: toEmail,
      subject,
      messageId: info?.messageId,
      smtpVerified: _smtpVerified,
    })

    return { ok: true, messageId: info?.messageId }
  } catch (err) {
    console.error('[MAIL ERROR] sendMail failed', {
      code: err?.code,
      responseCode: err?.responseCode,
      command: err?.command,
      message: err?.message,
    })
    throw createError({ statusCode: 502, message: 'SMTP error: envoi email impossible.' })
  }
}

export async function sendVerifyEmail({ email, token, locale = 'fr' }) {
  if (!email) throw createError({ statusCode: 400, message: 'email manquant.' })
  if (!token) throw createError({ statusCode: 400, message: 'token manquant.' })

  const config = useRuntimeConfig()
  const appUrl = getAppUrl(config)
  const url = `${appUrl}/verify-email?token=${encodeURIComponent(token)}`

  const subject = tEmail(
    locale,
    'emails.verify.subject',
    'Please confirm your email address — Les derniers léopards',
    {}
  )

  const greeting = tEmail(locale, 'emails.common.greeting', 'Hello,', {})
  const intro = tEmail(locale, 'emails.verify.intro', 'Please confirm your email address by clicking the link below:', {})
  const ignore = tEmail(
    locale,
    'emails.common.ignore',
    'If you did not request this, you can safely ignore this message.',
    {}
  )
  const closing = tEmail(locale, 'emails.common.closing', 'Sincerely,', {})
  const signature = tEmail(locale, 'emails.common.signature', 'Les derniers léopards', {})

  const text = [
    greeting,
    '',
    intro,
    url,
    '',
    ignore,
    '',
    closing,
    signature,
  ].join('\n')

  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;line-height:1.5">
      <p>${greeting}</p>
      <p>${intro}</p>
      <p><a href="${url}">${url}</a></p>
      <p>${ignore}</p>
      <p>${closing}<br/>${signature}</p>
    </div>
  `

  return sendEmail({ toEmail: email, subject, text, html })
}

export async function sendResetPasswordEmail({ email, token, locale = 'fr' }) {
  if (!email) throw createError({ statusCode: 400, message: 'email manquant.' })
  if (!token) throw createError({ statusCode: 400, message: 'token manquant.' })

  const config = useRuntimeConfig()
  const appUrl = getAppUrl(config)
  const url = `${appUrl}/reset-password?token=${encodeURIComponent(token)}`

  const subject = tEmail(
    locale,
    'emails.reset.subject',
    'Password reset — Les derniers léopards',
    {}
  )

  const greeting = tEmail(locale, 'emails.common.greeting', 'Hello,', {})
  const intro = tEmail(locale, 'emails.reset.intro', 'To reset your password, click the link below:', {})
  const ignore = tEmail(
    locale,
    'emails.common.ignore',
    'If you did not request this, you can safely ignore this message.',
    {}
  )
  const closing = tEmail(locale, 'emails.common.closing', 'Sincerely,', {})
  const signature = tEmail(locale, 'emails.common.signature', 'Les derniers léopards', {})

  const text = [
    greeting,
    '',
    intro,
    url,
    '',
    ignore,
    '',
    closing,
    signature,
  ].join('\n')

  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;line-height:1.5">
      <p>${greeting}</p>
      <p>${intro}</p>
      <p><a href="${url}">${url}</a></p>
      <p>${ignore}</p>
      <p>${closing}<br/>${signature}</p>
    </div>
  `

  return sendEmail({ toEmail: email, subject, text, html })
}
