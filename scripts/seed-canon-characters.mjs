/**
 * Phase 3 — Synchronise les fiches canon personnages depuis text-files/*.txt (voir scripts/canon-sources.mjs).
 * INSERT si absent, mise à jour si (project_id, slug) existe déjà — une seule passe, idempotent pour le contenu.
 *
 *   node --env-file=.env scripts/seed-canon-characters.mjs
 *
 * Prérequis MySQL : UNIQUE sur (project_id, slug) pour les lignes `characters` concernées.
 *
 * Variables optionnelles :
 *   SEED_PROJECT_SLUG=les-derniers-leopards   (défaut)
 *   SEED_TEXT_DIR=chemin/vers/text-files      (sinon dossier canon du projet)
 *   SEED_DRY_RUN=1                            liste les entrées sans MySQL
 *   SEED_RESTORE_TRASHED=1                     récupère aussi les fiches en corbeille (deleted_at)
 */
import mysql from 'mysql2/promise'
import { loadAllCanonCharacters } from './canon-sources.mjs'
import { canonCharactersUpsertSql } from '../server/utils/canonUpsertSql.js'

const DEFAULT_PROJECT_SLUG = 'les-derniers-leopards'

const env = process.env.NODE_ENV || 'development'
const isLocal = env === 'development' || env === 'local'

const host = isLocal
  ? (process.env.DB_HOST_LOCAL || process.env.DB_HOST || 'localhost')
  : (process.env.DB_HOST || 'localhost')
const port = Number(
  isLocal
    ? (process.env.DB_PORT_LOCAL || process.env.DB_PORT || 3306)
    : (process.env.DB_PORT || 3306),
)
const user = isLocal
  ? (process.env.DB_USER_LOCAL || process.env.DB_USER || 'root')
  : (process.env.DB_USER || 'root')
const password = isLocal
  ? (process.env.DB_PASSWORD_LOCAL ?? process.env.DB_PASSWORD ?? '')
  : (process.env.DB_PASSWORD ?? '')
const database = isLocal
  ? (process.env.DB_NAME_LOCAL || process.env.DB_NAME || 'derniers_leopards')
  : (process.env.DB_NAME || 'derniers_leopards')

const PROJECT_SLUG = String(process.env.SEED_PROJECT_SLUG || DEFAULT_PROJECT_SLUG).trim()
const DRY = String(process.env.SEED_DRY_RUN || '').trim() === '1'
const RESTORE_TRASHED = String(process.env.SEED_RESTORE_TRASHED || '').trim() === '1'

const { textDir, characters } = loadAllCanonCharacters()
console.log(`Sources : ${textDir} — ${characters.length} personnage(s) à traiter.`)

if (DRY) {
  for (const row of characters) {
    console.log(` · ${row.slug} — ${row.name} (${row.source})`)
  }
  console.log('(dry-run, aucune écriture MySQL)')
  process.exit(0)
}

const conn = await mysql.createConnection({
  host,
  port,
  user,
  password,
  database,
})

try {
  const [projects] = await conn.execute(
    'SELECT id, slug FROM projects WHERE slug = ? LIMIT 1',
    [PROJECT_SLUG],
  )
  const project = projects[0]
  if (!project) {
    console.error(`Aucun projet avec slug « ${PROJECT_SLUG} » dans « ${database} ».`)
    process.exitCode = 1
  } else {
    let inserted = 0
    let updated = 0

    const upsertSql = canonCharactersUpsertSql(RESTORE_TRASHED)

    if (RESTORE_TRASHED) console.log('(SEED_RESTORE_TRASHED actif → deleted_at vidé lors de l’UPSERT)')

    for (const row of characters) {
      const [hdr] = await conn.execute(upsertSql, [
        project.id,
        row.slug,
        row.name,
        row.description,
      ])

      /**
       * UPSERT (MySQL) : affectedRows 1 = INSERT, 2 = UPDATE (ligne existante modifiée),
       * 0 = clé en conflit mais valeurs identiques (aucun changement).
       */
      const ar = Number(hdr?.affectedRows ?? 0)
      if (ar === 1) {
        inserted += 1
        console.log(`+ ${row.slug} (${row.name})`)
      } else if (ar === 2) {
        updated += 1
        console.log(`↻ ${row.slug} (${row.name})`)
      } else if (ar === 0) {
        console.log(`· ${row.slug} (inchangé)`)
      } else {
        updated += 1
        console.log(`↻ ${row.slug} (${row.name}) [affectedRows=${ar}]`)
      }
    }

    console.log(
      `OK — projet « ${project.slug} » (id ${project.id}) : ${inserted} nouveau(x), ${updated} mis à jour.`,
    )
  }
} catch (err) {
  console.error('Échec :', err.message)
  process.exitCode = 1
} finally {
  await conn.end()
}
