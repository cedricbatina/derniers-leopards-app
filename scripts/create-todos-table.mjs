/**
 * Crée la table `todos` si elle n'existe pas (voir server/database/todos-schema.sql).
 * Utilise les mêmes variables que l'app : DB_*_LOCAL en dev, sinon DB_*.
 *
 * Exemple (PowerShell, à la racine du projet) :
 *   node scripts/create-todos-table.mjs
 *
 * Avec fichier .env (Node 20.6+) :
 *   node --env-file=.env scripts/create-todos-table.mjs
 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import mysql from 'mysql2/promise'

const __dirname = dirname(fileURLToPath(import.meta.url))
const sqlPath = join(__dirname, '..', 'server', 'database', 'todos-schema.sql')

const env = process.env.NODE_ENV || 'development'
const isLocal = env === 'development' || env === 'local'

const host = isLocal
  ? (process.env.DB_HOST_LOCAL || process.env.DB_HOST || 'localhost')
  : (process.env.DB_HOST || 'localhost')
const port = Number(
  isLocal
    ? (process.env.DB_PORT_LOCAL || process.env.DB_PORT || 3306)
    : (process.env.DB_PORT || 3306)
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

const sql = readFileSync(sqlPath, 'utf8')

const conn = await mysql.createConnection({
  host,
  port,
  user,
  password,
  database,
  multipleStatements: false,
})

try {
  await conn.query(sql)
  console.log(`OK — table todos vérifiée/créée sur la base « ${database} » (${host}:${port}).`)
} catch (err) {
  console.error('Échec SQL :', err.message)
  process.exitCode = 1
} finally {
  await conn.end()
}
