import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { cwd as processCwd } from 'node:process'
import { useRuntimeConfig } from '#imports'
import { canonCharactersUpsertSql } from './canonUpsertSql.js'
import { dbQuery } from './db.js'

/**
 * Répertoire contenant `scripts/canon-sources.mjs` et `text-files/`.
 * Priorité : `runtimeConfig.canonSyncRoot` → env `CANON_SYNC_ROOT` → `process.cwd()`.
 */
function projectRootDir() {
  let fromConfig = ''
  try {
    fromConfig = String(useRuntimeConfig().canonSyncRoot || '').trim()
  } catch {
    /* hors contexte Nitro */
  }
  const fromEnv = String(process.env.CANON_SYNC_ROOT || '').trim()
  return fromConfig || fromEnv || processCwd()
}

async function loadCanonSourcesModule() {
  const scriptPath = join(projectRootDir(), 'scripts', 'canon-sources.mjs')
  try {
    return await import(pathToFileURL(scriptPath).href)
  } catch (err) {
    const hint = scriptPath.replace(/\\/g, '/')
    const msg =
      err instanceof Error && err.message
        ? `${err.message} (${hint})`
        : `Cannot load canon sources (${hint})`
    const wrapped = new Error(msg)
    wrapped.cause = err
    throw wrapped
  }
}

function classifyUpsertHeader(hdr) {
  const ar = Number(hdr?.affectedRows ?? 0)
  if (ar === 1) return 'inserted'
  if (ar === 2) return 'updated'
  if (ar === 0) return 'unchanged'
  return 'updated_other'
}

/**
 * @param {number} projectId
 * @param {{ restoreTrashed?: boolean, textDir?: string }} opts
 */
export async function syncCanonCharactersFromFiles(projectId, opts = {}) {
  const { restoreTrashed = false, textDir } = opts
  const mod = await loadCanonSourcesModule()
  const load = mod.loadAllCanonCharacters
  if (typeof load !== 'function') {
    throw new Error('canon-sources: loadAllCanonCharacters manquant')
  }

  const { characters, textDir: textDirResolved } = load(textDir)
  const sql = canonCharactersUpsertSql(!!restoreTrashed)

  let inserted = 0
  let updated = 0
  let unchanged = 0

  for (const row of characters) {
    const hdr = await dbQuery(sql, [
      projectId,
      row.slug,
      row.name,
      row.description ?? null,
    ])
    const cls = classifyUpsertHeader(hdr)
    if (cls === 'inserted') inserted += 1
    else if (cls === 'updated' || cls === 'updated_other') updated += 1
    else unchanged += 1
  }

  return {
    textDir: textDirResolved,
    counts: {
      scanned: characters.length,
      inserted,
      updated,
      unchanged,
      restore_trashed: !!restoreTrashed,
    },
  }
}
