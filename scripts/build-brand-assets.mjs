/**
 * Dérive le pictogramme (sans texte) + fond transparent depuis public/images/logo-sonekeno.png,
 * puis génère favicons, apple-touch-icon et icônes PWA.
 *
 *   npm run icons:brand
 *
 * Optionnel :
 *   BRAND_MARK_TOP_RATIO=0.84   (hauteur gardée après trim ; trop bas = motif « coupé », trop haut = texte visible)
 *   BRAND_TRIM_THRESHOLD=20     (trim des marges noir)
 */
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import pngToIco from 'png-to-ico'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const sourcePng = join(root, 'public', 'images', 'logo-sonekeno.png')
const pub = join(root, 'public')
const markOut = join(root, 'public', 'images', 'logo-sonekeno-mark.png')

/** Garde uniquement la zone du haut pour retirer « SONEKENO » et la baseline (à ajuster si besoin). */
const _ratioRaw = parseFloat(String(process.env.BRAND_MARK_TOP_RATIO || '0.84').trim(), 10)
const MARK_TOP_RATIO = Math.min(
  0.95,
  Math.max(0.45, Number.isFinite(_ratioRaw) ? _ratioRaw : 0.84),
)
const TRIM_THRESHOLD = Number.parseInt(process.env.BRAND_TRIM_THRESHOLD || '20', 10) || 20

/**
 * Enlève surtout le noir de fond. Version prudente : les ombres grises du volume 3D
 * (faible saturation mais canaux > ~28) ne sont plus trouées → évite un logo « coupé en deux ».
 */
function keyNeutralBackdropToAlpha(buf) {
  const BG_CAP = 30
  for (let i = 0; i < buf.length; i += 4) {
    const r = buf[i]
    const g = buf[i + 1]
    const b = buf[i + 2]
    const a = buf[i + 3]
    const mx = Math.max(r, g, b)
    const mn = Math.min(r, g, b)
    const sat = mx < 1 ? 0 : (mx - mn) / mx
    if (mx >= BG_CAP) continue
    if (sat < 0.2) {
      const t = mx / BG_CAP
      buf[i + 3] = Math.round(a * t * t)
    }
  }
}

async function buildMarkBufferFromSource() {
  const trimmedBuf = await sharp(sourcePng)
    .trim({ threshold: TRIM_THRESHOLD })
    .ensureAlpha()
    .png()
    .toBuffer()

  const meta = await sharp(trimmedBuf).metadata()
  const cropH = Math.max(32, Math.floor(meta.height * MARK_TOP_RATIO))

  let rawBuf = await sharp(trimmedBuf)
    .extract({ left: 0, top: 0, width: meta.width, height: cropH })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  keyNeutralBackdropToAlpha(rawBuf.data)

  return sharp(rawBuf.data, {
    raw: { width: rawBuf.info.width, height: rawBuf.info.height, channels: 4 },
  }).png().toBuffer()
}

async function renderIconSquare(markBuf, size) {
  return sharp(markBuf)
    .resize(size, size, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer()
}

async function maskableFromMark(markBuf, size) {
  const inner = Math.round(size * 0.74)
  const innerBuf = await renderIconSquare(markBuf, inner)
  const left = Math.round((size - inner) / 2)
  const top = Math.round((size - inner) / 2)
  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: innerBuf, left, top }])
    .png()
    .toBuffer()
}

async function main() {
  const markBuf = await buildMarkBufferFromSource()
  writeFileSync(markOut, markBuf)
  console.log(
    `OK — logo-sonekeno-mark.png (recadrage ${Math.round(MARK_TOP_RATIO * 100)} % du bloc après trim, fond détouré)`,
  )

  const fav16 = await renderIconSquare(markBuf, 16)
  const fav32 = await renderIconSquare(markBuf, 32)
  const fav48 = await renderIconSquare(markBuf, 48)
  const apple = await renderIconSquare(markBuf, 180)
  const pwa192 = await renderIconSquare(markBuf, 192)
  const pwa512 = await renderIconSquare(markBuf, 512)
  const m192 = await maskableFromMark(markBuf, 192)
  const m512 = await maskableFromMark(markBuf, 512)

  writeFileSync(join(pub, 'favicon-16x16.png'), fav16)
  writeFileSync(join(pub, 'favicon-32x32.png'), fav32)
  writeFileSync(join(pub, 'favicon-48x48.png'), fav48)
  writeFileSync(join(pub, 'apple-touch-icon.png'), apple)
  writeFileSync(join(pub, 'pwa-192x192.png'), pwa192)
  writeFileSync(join(pub, 'pwa-512x512.png'), pwa512)
  writeFileSync(join(pub, 'icon-192x192.png'), pwa192)
  writeFileSync(join(pub, 'icon-512x512.png'), pwa512)
  writeFileSync(join(pub, 'maskable-icon-192x192.png'), m192)
  writeFileSync(join(pub, 'maskable-icon-512x512.png'), m512)

  const icoBuf = await pngToIco([fav48, fav32, fav16])
  writeFileSync(join(pub, 'favicon.ico'), icoBuf)

  console.log('OK — favicon.ico + PNG PWA / favicons régénérés depuis le vrai logo-sonekeno.png')
}

main().catch((e) => {
  console.error(e)
  process.exitCode = 1
})
