import { Client } from 'pg'

export async function ensureDatabaseExists(cfg: {
  host: string
  port: number
  user: string
  password?: string
  database: string
}) {
  const dbName = cfg.database
  // Connect to default system database 'postgres' to check/create target database
  const client = new Client({
    host: cfg.host,
    port: cfg.port,
    user: cfg.user,
    password: cfg.password,
    database: 'postgres'
  })

  try {
    await client.connect()
    const checkRes = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    )

    if (checkRes.rowCount === 0) {
      console.log(`[DatabaseModule] Database "${dbName}" not found. Creating it now...`)
      // Identifier escaping for safety
      await client.query(`CREATE DATABASE "${dbName.replace(/"/g, '""')}"`)
      console.log(`[DatabaseModule] Database "${dbName}" created successfully!`)
    }
  } catch (err) {
    console.warn(`[DatabaseModule] Automatic DB check/creation failed:`, err)
  } finally {
    await client.end().catch(() => {})
  }
}

