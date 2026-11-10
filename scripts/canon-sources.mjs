/**
 * Charge les entrées « personnage » depuis les .txt narratifs (sans dupliquer le texte dans le JS).
 *
 * Sources :
 * 1. Import personnages existant : identifiants conservés.
 * 2. Fiches détaillées .txt/.md et fiche individuelle NZUNGANI.
 * 3. Résumés et notices nominatives ; jamais les annexes globales comme un personnage.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DEFAULT_TEXT_DIR = join(__dirname, '..', 'text-files')

const MAX_DESC_CHARS = 60000 // marge sous limite TEXT MySQL (~64 Ko)

/** @param {string} input */
export function toSlug(input) {
  return String(input || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/** Nom court pour la colonne `name` (avant première parenthèse) */
export function displayName(rawTitleLine) {
  const t = String(rawTitleLine || '').trim()
    .replace(/^FICHE CANON —\s*/i, '')
    .trim()
  const cut = t.indexOf('(')
  return (cut >= 0 ? t.slice(0, cut) : t).trim() || t
}

/**
 * Ligne de titre type « MUTINU », « NKAKA NZONGO », « NZUNGANI (chef… »
 */
export function looksLikeResumeHeading(line) {
  const t = line.trim()
  if (!t || t === '//' || /^\/\/+$/.test(t)) return false
  if (/^FICHE CANON/i.test(t)) return false
  if (/^Protocole\b/i.test(t)) return false
  if (/^Technique\b/i.test(t)) return false
  if (/^Petit protocole\b/i.test(t)) return false
  if (/^Codes\b/i.test(t)) return false
  if (/^Main\b/i.test(t)) return false
  if (/^Les \d/i.test(t)) return false
  if (/^Résultat\b/i.test(t)) return false
  if (/^Objectif\b/i.test(t)) return false
  if (/^[a-zàâäéèêëïîôùûüœæç]/u.test(t)) return false
  if (/^\d+\)/.test(t)) return false

  const tokens = t.split(/\s+/).filter(Boolean)
  if (!tokens.length) return false
  const tok = (s) =>
    /^[A-ZÀÂÄÉÈÊËÎÙÛÜÇ0-9]+(?:['\-][A-ZÀÂÄÉÈÊËÎÙÛÜÇ]+)?$/.test(s)
  if (!tok(tokens[0]) || tokens[0].length < 2) return false
  if (tokens.length >= 2 && !tokens[1].startsWith('(')) {
    const w1 = tokens[1].replace(/^[(']+/, '').split(/'/)[0] || tokens[1]
    if (/^[a-z]/u.test(w1)) return false
    if (w1.length >= 2 && !tok(w1)) return false
  }
  return true
}

/**
 * Découpe un fichier en blocs séparés par une ligne « FICHE CANON — … »
 * @param {string} content
 */
export function splitFicheCanonBlocks(content) {
  const lines = content.split(/\r?\n/)
  /** @type {{ titleLine: string, body: string }[]} */
  const blocks = []
  /** @type {string | null} */
  let titleLine = null
  const buf = []

  const flush = () => {
    if (!titleLine) return
    blocks.push({ titleLine, body: buf.join('\n').trimEnd() })
    titleLine = null
    buf.length = 0
  }

  for (const line of lines) {
    if (/^(?:#\s+)?FICHE CANON —\s+.+/i.test(line.trim())) {
      flush()
      titleLine = line.trim().replace(/^#\s+/, '')
      continue
    }
    if (!titleLine) continue
    buf.push(line)
  }
  flush()
  return blocks
}

function truncateDesc(s, hint) {
  if (Buffer.byteLength(s, 'utf8') <= MAX_DESC_CHARS) return s
  const ell = `\n… [truncated, ${hint}]`
  const limit = MAX_DESC_CHARS - Buffer.byteLength(ell, 'utf8')
  let bytes = 0
  let out = ''
  for (const char of s) {
    const size = Buffer.byteLength(char, 'utf8')
    if (bytes + size > limit) break
    bytes += size
    out += char
  }
  return out + ell
}

/** @param {string} dir */
export function loadFicheCanonFromDir(dir) {
  /** @type {Map<string, { slug: string, name: string, description: string, source: string }>} */
  const bySlug = new Map()

  if (!existsSync(dir)) return bySlug

  const names = readdirSync(dir).sort().filter(
    (f) => /\.(?:txt|md)$/i.test(f) && /FICHE CANON/i.test(f),
  )

  for (const fname of names) {
    const full = join(dir, fname)
    let text
    try {
      text = readFileSync(full, 'utf8')
    } catch {
      continue
    }
    const blocks = splitFicheCanonBlocks(text)

    blocks.forEach((block, idx) => {
      const dn = displayName(block.titleLine)
      const slug = toSlug(dn)
      if (!slug) return
      // Ce bloc décrit un comptoir, pas une personne.
      if (slug === 'buma') return

      const description = truncateDesc(
        [block.titleLine, block.body].filter(Boolean).join('\n\n'),
        `${fname}${blocks.length > 1 ? `#${idx + 1}` : ''}`,
      )

      bySlug.set(slug, {
        slug,
        name: dn.trim(),
        description,
        source: blocks.length > 1 ? `${fname} · ${slug}` : fname,
      })
    })
    // Une fiche peut contenir un encart de lieu avant les compléments de son
    // personnage principal. Ne pas attribuer ces compléments au lieu.
    const appendixStart = text.search(/^## Compl[eé]ment/m)
    if (appendixStart >= 0 && blocks.length) {
      const owner = bySlug.get(toSlug(displayName(blocks[0].titleLine)))
      const appendix = text.slice(appendixStart).trim()
      if (owner && !owner.description.includes(appendix)) {
        owner.description = truncateDesc(`${owner.description}\n\n${appendix}`, fname)
      }
    }
  }

  return bySlug
}

/**
 * Parse text-files/fiches personnages resume.txt
 */
export function loadResumeCharacters(resumePath) {
  /** @type {Map<string, { slug: string, name: string, description: string, source: string }>} */
  const bySlug = new Map()

  if (!existsSync(resumePath)) return bySlug

  const raw = readFileSync(resumePath, 'utf8')
  /** @type {string | null} */
  let currentSlug = null
  /** @type {string | null} */
  let currentName = null
  const buf = []

  const flush = () => {
    if (!currentSlug) return
    const desc = buf.join('\n').trim()
    if (!desc) {
      buf.length = 0
      return
    }
    const prev = bySlug.get(currentSlug)
    const merged = prev ? `${prev.description}\n---\n${desc}` : desc
    const namePick = prev && (prev.name || '').length >= (currentName?.length || 0)
      ? prev.name
      : (currentName || currentSlug)

    bySlug.set(currentSlug, {
      slug: currentSlug,
      name: namePick,
      description: truncateDesc(merged, 'resume.txt'),
      source: 'resume.txt',
    })
    buf.length = 0
    currentName = null
  }

  for (const line of raw.split(/\r?\n/)) {
    const t = line.trim()
    // Les annexes multi-personnages ne sont pas la suite de la dernière fiche.
    if (/^##\s/.test(t)) break
    if (t.startsWith('FICHE CANON')) {
      const dn = displayName(t)
      const slug = toSlug(dn)
      if (!slug) continue
      if (slug === currentSlug) buf.push(line)
      else {
        flush()
        currentSlug = slug
        currentName = dn
        buf.push(line)
      }
      continue
    }

    if (looksLikeResumeHeading(line)) {
      flush()
      currentName = displayName(line.trim())
      currentSlug = toSlug(currentName)
      if (!currentSlug) {
        buf.length = 0
        currentName = null
        continue
      }
      buf.length = 0
      continue
    }

    buf.push(line)
  }
  flush()
  return bySlug
}

/**
 * Conserve les identités de l'import existant et rassemble leurs enrichissements.
 * @param {string} [textDir]
 */
export function loadAllCanonCharacters(textDir = process.env.SEED_TEXT_DIR || DEFAULT_TEXT_DIR) {
  const resumePath = join(textDir, 'fiches personnages resume.txt')
  const fromFiles = loadFicheCanonFromDir(textDir)
  const fromResume = loadResumeCharacters(resumePath)

  // Les slugs d'import existants sont conservés ; un titre honorifique ne crée
  // pas un second personnage (ex. NKAKA NZONGO -> nzongo).
  const merged = new Map()
  const identity = new Map()
  const aliases = { 'nkaka-nzongo': 'nzongo', 'maa-miakubuku': 'maa-miakubuku-mia-mualu', 'tusikila': 'ma-tusikila', 'mama-tusikila': 'ma-tusikila', 'mama-dobadola': 'maa-dobadola' }
  const identityKey = (name) => aliases[toSlug(name)] || toSlug(name)
  const importPath = join(textDir, 'personnages_les_derniers_leopards_pour_insertion_db.txt')
  if (existsSync(importPath)) {
    for (const line of readFileSync(importPath, 'utf8').split(/\r?\n/)) {
      const cols = line.split('|')
      if (cols.length !== 9 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(cols[0])) continue
      const [slug, name, , , aliases, clans, period, description, relations] = cols
      merged.set(slug, { slug, name, description: [description, clans && `Lignée : ${clans}`, period && `Période : ${period}`, relations && `Relations : ${relations}`].filter(Boolean).join('\n\n'), source: 'personnages_les_derniers_leopards_pour_insertion_db.txt' })
      identity.set(identityKey(name), slug)
      identity.set(identityKey(slug), slug)
    }
  }
  const add = (row) => {
    const slug = identity.get(identityKey(row.name)) || row.slug
    const prev = merged.get(slug)
    const description = prev && !prev.description.includes(row.description)
      ? `${prev.description}\n\n${row.description}` : (prev?.description || row.description)
    merged.set(slug, { ...row, slug, name: prev?.name || row.name, description: truncateDesc(description, row.source) })
    identity.set(identityKey(row.name), slug)
  }
  for (const row of fromResume.values()) add(row)
  for (const row of fromFiles.values()) add(row)
  // Fiche individuelle historique, sans préfixe FICHE CANON dans son nom.
  const nzunganiPath = readdirSync(textDir).find((f) => /^NZUNGANI .*\.txt$/i.test(f))
  if (nzunganiPath) add({ slug: 'nzungani', name: 'Nzungani', description: readFileSync(join(textDir, nzunganiPath), 'utf8'), source: nzunganiPath })
  // Les notices de continuité sont rattachées à leur personnage explicite.
  const notices = existsSync(resumePath) ? readFileSync(resumePath, 'utf8').split(/\r?\n/) : []
  for (const line of notices) {
    const match = line.match(/^\*\*([^*:]+)(?:\s*:[^*]*)?\*\*\s*(.*)$/)
    if (!match) continue
    const label = match[1].trim().replace(/,.*$/, '')
    let slug = identity.get(identityKey(label))
    // Ces deux compagnons sont nommés explicitement dans les notices Founder,
    // sans fiche individuelle dans le corpus historique d'import.
    if (!slug && ['kimbembe', 'bikuta'].includes(toSlug(label))) {
      slug = toSlug(label)
      identity.set(identityKey(label), slug)
      merged.set(slug, { slug, name: label, description: '', source: 'fiches personnages resume.txt' })
    }
    if (!slug) continue
    const row = merged.get(slug)
    if (row && !row.description.includes(line)) row.description = truncateDesc(`${row.description}\n\n${line}`, 'notices de continuité')
  }

  const characters = [...merged.values()].sort((a, b) => {
    const n = a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' })
    if (n !== 0) return n
    return a.slug.localeCompare(b.slug)
  })

  const shortDir = textDir.includes('text-files') ? 'text-files' : textDir
  return { textDir: shortDir, characters }
}

