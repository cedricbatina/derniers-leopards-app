/**
 * Reconcile the Kongo Dibuidi canon with Sonekeno's working database.
 *
 * It deliberately never writes `scenes.content`: that column belongs to the author.
 * All mutations are in one transaction and can be safely re-run.
 *
 *   node --env-file=.env scripts/enrich-kongo-dibuidi-db.mjs --dry-run
 *   node --env-file=.env scripts/enrich-kongo-dibuidi-db.mjs --remote --apply
 */
import mysql from 'mysql2/promise'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(fileURLToPath(new URL('..', import.meta.url)))
const canonRoot = process.env.CANON_SOURCE_ROOT || root
const dryRun = !process.argv.includes('--apply') || process.argv.includes('--dry-run')
const remote = process.argv.includes('--remote')
if (!dryRun && !remote && !process.argv.includes('--local')) throw new Error('Choisir --remote ou --local avec --apply')
const db = remote ? {
  host: process.env.DB_HOST, port: Number(process.env.DB_PORT || 3306), user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, database: process.env.DB_NAME,
} : {
  host: process.env.DB_HOST_LOCAL || process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT_LOCAL || process.env.DB_PORT || 3306),
  user: process.env.DB_USER_LOCAL || process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD_LOCAL ?? process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME_LOCAL || process.env.DB_NAME || 'derniers_leopards',
}
if (remote && (db.host !== '6i695q.myd.infomaniak.com' || db.database !== '6i695q_lesDerniersLeopards')) throw new Error('Cible Infomaniak incorrecte')
const counts = Object.fromEntries(['characters', 'profiles', 'dossiers', 'kinships', 'locations', 'tags', 'parts', 'chapters', 'scenes', 'scene_characters', 'scene_tags', 'timeline_events'].map(k => [k, { inserted: 0, updated: 0, unchanged: 0 }]))
const bump = (table, kind) => counts[table][kind]++
const slug = (value) => String(value).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
const titleFromSlug = (value) => String(value).replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
const text = (file) => readFileSync(join(canonRoot, 'text-files', file), 'utf8')

function sourceRows() {
  return text('scenes_les_derniers_leopards_pour_insertion_db.txt').split(/\r?\n/)
    .filter(line => /^(EXISTING_DB|A_CREER_CHAPITRE_EXISTANT)/.test(line))
    .map(line => {
      const p = line.split('|')
      return { status: p[0], bookSlug: p[1], partNo: Number(p[2]), partSlug: p[3], chapterNo: Number(p[4]), chapterSlug: p[5], sceneNo: Number(p[6]), sceneSlug: p[7], title: p[8], pov: p[9], location: p[10], period: p[11], summary: p[12], conflict: p[13], turningPoint: p[14], outcome: p[15], tags: (p[16] || '').split(',').map(x => x.trim()).filter(Boolean) }
    })
}

function characterRows() {
  const lines = text('personnages_les_derniers_leopards_pour_insertion_db.txt').split(/\r?\n/)
  const rows = []
  let active = false
  for (const line of lines) {
    if (line.startsWith('SECTION 1')) active = true
    if (line.startsWith('SECTION 2')) break
    if (!active || !line || line.startsWith('#') || !line.includes('|')) continue
    const p = line.split('|')
    if (p.length < 8 || !/^[a-z0-9-]+$/.test(p[0])) continue
    rows.push({ slug: p[0], name: p[1], status: p[2], role: p[3], rank: p[4], origin: p[5], ages: p[6], description: p[7], relations: p[8] || '' })
  }
  return rows
}

function canonicalDescriptions() {
  const aliases = { tusikila: 'ma-tusikila', 'mama-tusikila': 'ma-tusikila', 'nkaka-nzongo': 'nzongo', 'maa-miakubuku': 'maa-miakubuku-mia-mualu' }
  const output = new Map()
  // Markdown fiches are the current, reviewed source; legacy .txt supplies
  // only characters that do not yet have a markdown fiche.
  const files = readdirSync(join(canonRoot, 'text-files')).filter(f => /FICHE CANON/i.test(f) && /\.(md|txt)$/i.test(f)).sort((a, b) => Number(/\.md$/i.test(a)) - Number(/\.md$/i.test(b)))
  for (const file of files) {
    const body = readFileSync(join(canonRoot, 'text-files', file), 'utf8').trim()
    const header = body.match(/^(?:#\s*)?FICHE CANON —\s+([^\n(]+)/im)?.[1]
    if (!header) continue
    const key = aliases[slug(header)] || slug(header)
    if (key) output.set(key, body.slice(0, 60000))
  }
  return output
}

function macroRows() {
  const lines = text('scenes_les_derniers_leopards_pour_insertion_db.txt').split(/\r?\n/)
  const start = lines.findIndex(x => x.startsWith('SECTION 2'))
  return lines.slice(start + 1).filter(x => /^m\d+[a-z-]*\|/.test(x)).map(line => {
    const p = line.split('|')
    return { slug: p[0], title: p[1], period: p[2], location: p[3], people: p[4], summary: p[5] }
  })
}

function dateFromPeriod(value) {
  const s = String(value).toLowerCase()
  const year = s.match(/\b(1[5-7]\d\d)\b/)?.[1]
  if (!year) return null
  const months = { janvier: '01', 'février': '02', fevrier: '02', mars: '03', avril: '04', mai: '05', juin: '06', juillet: '07', août: '08', aout: '08', septembre: '09', octobre: '10', novembre: '11', décembre: '12', decembre: '12' }
  for (const [word, month] of Object.entries(months)) if (s.includes(word)) return `${year}-${month}-01`
  return /^\d{4}$/.test(s.trim()) ? `${year}-01-01` : null
}

const canonicalKinships = [
  ['kinuani', 'mutinu', 'spouse', 'unknown', 'certain', 'Longo célébré en août 1639.'],
  ['kinuani', 'ma-ntombo', 'sibling', 'maternel', 'certain', 'Même mère Ma Musakanda.'],
  ['mutinu', 'lufuandi', 'sibling', 'unknown', 'certain', 'Sœurs ; Lufuandi est le slug canonique.'],
  ...['nkodia', 'muanda', 'mpasi', 'lunungu'].flatMap(child => [
    ['kinuani', child, 'parent', 'unknown', 'certain', 'Parenté canonique Kongo Dibuidi.'],
    ['mutinu', child, 'parent', 'unknown', 'certain', 'Parenté canonique Kongo Dibuidi.'],
  ]),
]

const conn = await mysql.createConnection(db)
const [projects] = await conn.execute('SELECT id FROM projects WHERE slug = ? LIMIT 1', ['les-derniers-leopards'])
if (!projects[0]) throw new Error('Projet les-derniers-leopards introuvable')
const projectId = projects[0].id
// The historical schema predates projects: its one book belongs to the saga
// project, while the 45 Kongo Dibuidi scenes point to it from project 2.
const [books] = await conn.execute('SELECT DISTINCT b.id FROM scenes s JOIN chapters c ON c.id=s.chapter_id JOIN parts p ON p.id=c.part_id JOIN books b ON b.id=p.book_id WHERE s.project_id=? AND b.slug=? AND b.deleted_at IS NULL', [projectId, 'tome-1-la-desolation'])
if (books.length !== 1) throw new Error('Livre rattaché aux scènes Kongo Dibuidi introuvable')
const bookId = books[0].id
const [target] = await conn.query('SELECT DATABASE() AS db')
if (target[0].db !== db.database) throw new Error('Base active inattendue')
console.log(JSON.stringify({ database: target[0].db, projectId, bookId, dryRun }))
// Production map: scenes and characters have no book_id; timeline_events has no book_id.
// BATINA OS db-packs/sonekeno/2026-07-31; verified remote failure 2026-11-26.

async function one(sql, params) { const [rows] = await conn.execute(sql, params); return rows[0] }
async function upsertLocation(name) {
  if (!name) return null
  const key = slug(name)
  let row = await one('SELECT id FROM locations WHERE slug = ? LIMIT 1', [key])
  if (!row) { const [h] = await conn.execute('INSERT INTO locations (slug, name, kind) VALUES (?, ?, ?)', [key, name, 'lieu narratif']); bump('locations', 'inserted'); row = { id: h.insertId } }
  else bump('locations', 'unchanged')
  return row.id
}
async function characterId(nameOrSlug) {
  const key = slug(nameOrSlug)
  const aliases = { 'maa-tusikila': 'ma-tusikila', tusikila: 'ma-tusikila', 'ta-ndala': 'ndala', 'ta-mualu': 'ta-mualu', 'ne-mberi': 'ta-mberi', 'ne-mawungu': 'ta-mahungu', 'ta-mukono': 'ta-mahungu', 'maa-miakubuku': 'maa-miakubuku-mia-mualu', 'nganga-mungua': 'nganga-mungua' }
  const target = aliases[key] || key
  const row = await one('SELECT id FROM characters WHERE project_id = ? AND slug = ? AND deleted_at IS NULL LIMIT 1', [projectId, target])
  return row?.id || null
}
async function upsertTag(name) {
  const key = slug(name)
  let row = await one('SELECT id FROM tags WHERE slug = ? LIMIT 1', [key])
  if (!row) { const [h] = await conn.execute('INSERT INTO tags (slug, name) VALUES (?, ?)', [key, name.slice(0, 64)]); bump('tags', 'inserted'); row = { id: h.insertId } }
  else bump('tags', 'unchanged')
  return row.id
}

try {
  await conn.beginTransaction()
  const ficheBySlug = canonicalDescriptions()
  for (const row of characterRows()) {
    row.description = ficheBySlug.get(row.slug) || row.description
    const existing = await one('SELECT id, name, description FROM characters WHERE project_id = ? AND slug = ? LIMIT 1', [projectId, row.slug])
    let id
    if (!existing) { const [h] = await conn.execute('INSERT INTO characters (project_id, slug, name, description) VALUES (?, ?, ?, ?)', [projectId, row.slug, row.name, row.description]); id = h.insertId; bump('characters', 'inserted') }
    else { id = existing.id; if (!existing.description && row.description) { await conn.execute('UPDATE characters SET description = ? WHERE id = ?', [row.description, id]); bump('characters', 'updated') } else bump('characters', 'unchanged') }
    const profile = await one('SELECT character_id, role_in_story, status_rank FROM character_profiles WHERE character_id = ?', [id])
    const profileValues = [row.role, row.ages, row.rank, row.description]
    if (!profile) { await conn.execute('INSERT INTO character_profiles (character_id, is_pov, role_in_story, status_rank, physical) VALUES (?, ?, ?, ?, ?)', [id, /principal|héros|héroïne/i.test(row.role) ? 1 : 0, row.role.slice(0, 255), row.rank.slice(0, 128), null]); bump('profiles', 'inserted') }
    else if ((!profile.role_in_story && profileValues[0]) || (!profile.status_rank && profileValues[2])) { await conn.execute('UPDATE character_profiles SET role_in_story = COALESCE(NULLIF(role_in_story, \'\'), ?), status_rank = COALESCE(NULLIF(status_rank, \'\'), ?) WHERE character_id = ?', [profileValues[0].slice(0, 255), profileValues[2].slice(0, 128), id]); bump('profiles', 'updated') } else bump('profiles', 'unchanged')
    const dossier = await one('SELECT character_id, canon_status, ages, origin, public_role, notes FROM character_dossiers WHERE character_id = ?', [id])
    if (!dossier) { await conn.execute('INSERT INTO character_dossiers (character_id, canon_status, logline, ages, origin, public_role, notes) VALUES (?, ?, ?, ?, ?, ?, ?)', [id, 'canon', row.description.slice(0, 255), row.ages.slice(0, 80), row.origin.slice(0, 255), row.role.slice(0, 255), `Relations documentées : ${row.relations}\n\n${row.description}`]); bump('dossiers', 'inserted') }
    else if (dossier.canon_status !== 'canon' || (!dossier.ages && row.ages) || (!dossier.origin && row.origin) || (!dossier.public_role && row.role)) { await conn.execute('UPDATE character_dossiers SET canon_status = \'canon\', ages = COALESCE(NULLIF(ages, \'\'), ?), origin = COALESCE(NULLIF(origin, \'\'), ?), public_role = COALESCE(NULLIF(public_role, \'\'), ?) WHERE character_id = ?', [row.ages.slice(0, 80), row.origin.slice(0, 255), row.role.slice(0, 255), id]); bump('dossiers', 'updated') } else bump('dossiers', 'unchanged')
    if (dossier && row.description && !String(dossier.notes || '').includes(row.description)) {
      await conn.execute('UPDATE character_dossiers SET notes=? WHERE character_id=?', [ [dossier.notes, 'Source canon GitHub — 2026-11-26', row.description].filter(Boolean).join('\n\n'), id ])
      if (dossier.canon_status === 'canon' && dossier.ages && dossier.origin && dossier.public_role) { counts.dossiers.unchanged--; bump('dossiers','updated') }
    }
  }

  for (const [from, to, relation, line, certainty, notes] of canonicalKinships) {
    const fromId = await characterId(from); const toId = await characterId(to)
    if (!fromId || !toId) continue
    const existing = await one('SELECT id, relation, line, certainty, notes FROM character_kinships_v2 WHERE from_character_id = ? AND to_character_id = ? AND relation = ? LIMIT 1', [fromId, toId, relation])
    if (!existing) { await conn.execute('INSERT INTO character_kinships_v2 (from_character_id, to_character_id, relation, line, certainty, notes) VALUES (?, ?, ?, ?, ?, ?)', [fromId, toId, relation, line, certainty, notes]); bump('kinships', 'inserted') }
    else if (existing.relation !== relation || existing.line !== line || existing.certainty !== certainty || existing.notes !== notes) { await conn.execute('UPDATE character_kinships_v2 SET relation=?, line=?, certainty=?, notes=? WHERE id=?', [relation, line, certainty, notes, existing.id]); bump('kinships', 'updated') } else bump('kinships', 'unchanged')
  }

  for (const row of sourceRows()) {
    let part = await one('SELECT id FROM parts WHERE book_id = ? AND (slug = ? OR part_no = ?) ORDER BY slug = ? DESC LIMIT 1', [bookId, row.partSlug, row.partNo, row.partSlug])
    if (!part) { const [h] = await conn.execute('INSERT INTO parts (project_id, book_id, slug, part_no, title) VALUES (?, ?, ?, ?, ?)', [projectId, bookId, row.partSlug, row.partNo, titleFromSlug(row.partSlug)]); part = { id: h.insertId }; bump('parts', 'inserted') }
    else bump('parts', 'unchanged')
    // Chapter slugs have historical aliases; chapter number inside its part is
    // stable and avoids duplicating an existing chapter during reconciliation.
    let chapter = await one('SELECT id FROM chapters WHERE part_id = ? AND (slug = ? OR chapter_no = ?) ORDER BY slug = ? DESC LIMIT 1', [part.id, row.chapterSlug, row.chapterNo, row.chapterSlug])
    if (!chapter) { const [h] = await conn.execute('INSERT INTO chapters (project_id, part_id, slug, chapter_no, title) VALUES (?, ?, ?, ?, ?)', [projectId, part.id, row.chapterSlug, row.chapterNo, titleFromSlug(row.chapterSlug)]); chapter = { id: h.insertId }; bump('chapters', 'inserted') }
    else bump('chapters', 'unchanged')
    const locationId = await upsertLocation(row.location.replace(/(?:Ta Mukono|Ne Mahungu|Ta Mahungu)/g, 'Ne Mawungu'))
    const povId = await characterId(row.pov)
    const existing = await one('SELECT id, title, chapter_id, scene_no, pov_character_id, location_id, objective, time_of_day, summary, conflict, turning_point, outcome, hook, deleted_at FROM scenes WHERE project_id = ? AND slug = ? LIMIT 1', [projectId, row.sceneSlug])
    if (existing?.deleted_at) throw new Error('Scène en corbeille : '+row.sceneSlug)
    if (existing && Number(existing.chapter_id) !== Number(chapter.id)) throw new Error('Rattachement divergent : '+row.sceneSlug)
    const period = 'Période : '+row.period
    const objective = !existing?.objective || /^Période\s*:/i.test(existing.objective) ? period : existing.objective
    const vals = [chapter.id, row.sceneNo, row.title, povId ?? existing?.pov_character_id ?? null, locationId ?? existing?.location_id ?? null, row.summary, row.conflict, row.turningPoint, row.outcome]
    let sceneId
    if (!existing) { const [h] = await conn.execute('INSERT INTO scenes (project_id, slug, chapter_id, scene_no, title, pov_character_id, location_id, objective, summary, conflict, turning_point, outcome, hook) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [projectId, row.sceneSlug, ...vals.slice(0, 5), objective, ...vals.slice(5), null]); sceneId = h.insertId; bump('scenes', 'inserted') }
    else { sceneId = existing.id; const changed = existing.objective !== objective || ['chapter_id','scene_no','title','pov_character_id','location_id','summary','conflict','turning_point','outcome'].some((k, i) => String(existing[k] ?? '') !== String(vals[i] ?? '')); if (changed) { await conn.execute('UPDATE scenes SET chapter_id=?, scene_no=?, title=?, pov_character_id=?, location_id=?, objective=?, summary=?, conflict=?, turning_point=?, outcome=? WHERE id=?', [...vals.slice(0, 5), objective, ...vals.slice(5), sceneId]); bump('scenes', 'updated') } else bump('scenes', 'unchanged') }
    if (povId) { const link = await one('SELECT scene_id FROM scene_characters WHERE scene_id=? AND character_id=?', [sceneId, povId]); if (!link) { await conn.execute('INSERT INTO scene_characters (scene_id, character_id, role, notes) VALUES (?, ?, ?, ?)', [sceneId, povId, 'POV', 'Point de vue canonique']); bump('scene_characters', 'inserted') } else bump('scene_characters', 'unchanged') }
    for (const label of row.tags) { const tagId = await upsertTag(label); const link = await one('SELECT scene_id FROM scene_tags WHERE scene_id=? AND tag_id=?', [sceneId, tagId]); if (!link) { await conn.execute('INSERT INTO scene_tags (scene_id, tag_id) VALUES (?, ?)', [sceneId, tagId]); bump('scene_tags', 'inserted') } else bump('scene_tags', 'unchanged') }
  }

  for (const row of macroRows()) {
    const locationId = await upsertLocation(row.location)
    const eventDate = dateFromPeriod(row.period)
    const existing = await one("SELECT id, title, DATE_FORMAT(event_date, '%Y-%m-%d') AS event_date, location_id, summary FROM timeline_events WHERE slug = ? LIMIT 1", [row.slug])
    if (!existing) { await conn.execute('INSERT INTO timeline_events (slug, title, event_date, location_id, summary, tags) VALUES (?, ?, ?, ?, ?, ?)', [row.slug, row.title, eventDate, locationId, row.summary, row.people]); bump('timeline_events', 'inserted') }
    else if (existing.title !== row.title || existing.event_date !== eventDate || Number(existing.location_id) !== Number(locationId) || existing.summary !== row.summary) { await conn.execute('UPDATE timeline_events SET title=?, event_date=?, location_id=?, summary=?, tags=? WHERE id=?', [row.title, eventDate, locationId, row.summary, row.people, existing.id]); bump('timeline_events', 'updated') } else bump('timeline_events', 'unchanged')
  }
  if (dryRun) await conn.rollback(); else await conn.commit()
  console.log(JSON.stringify({ mode: dryRun ? 'dry-run (rollback)' : 'applied', project_id: projectId, book_id: bookId, source_scenes: sourceRows().length, source_characters: characterRows().length, counts }, null, 2))
} catch (err) {
  await conn.rollback()
  throw err
} finally { await conn.end() }
