import mysql from 'mysql2/promise'

let _pool

export function dbPool() {
  if (_pool) return _pool

  const config = useRuntimeConfig()

  _pool = mysql.createPool({
    host: config.DB_HOST,
    port: config.DB_PORT,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
    waitForConnections: true,
    connectionLimit: 5,
    maxIdle: 5,
    idleTimeout: 60000,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    charset: 'utf8mb4',
  })

  return _pool
}

export async function dbQuery(sql, params = []) {
  const pool = dbPool()
  const [rows] = await pool.execute(sql, params)
  return rows
}
