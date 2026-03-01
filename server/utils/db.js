import mysql from 'mysql2/promise'
let _pool

export function dbPool() {
  if (_pool) return _pool

  const config = useRuntimeConfig()
  const env = process.env.NODE_ENV || 'development'

  // Choix de la config selon l'environnement
  const isLocal = env === 'development' || env === 'local'
  const dbConfig = isLocal ? {
    host: config.DB_HOST_LOCAL || 'localhost',
    port: config.DB_PORT_LOCAL || 3306,
    user: config.DB_USER_LOCAL || 'root',
    password: config.DB_PASSWORD_LOCAL || '',
    database: config.DB_NAME_LOCAL || 'derniers_leopards',
  } : {
    host: config.DB_HOST,
    port: config.DB_PORT,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
  }

  _pool = mysql.createPool({
    ...dbConfig,
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
