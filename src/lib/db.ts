import { Pool } from "pg";

let pool: Pool | undefined;

export function getDatabaseUrl() {
  return process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
}

export function getPool() {
  const connectionString = getDatabaseUrl();

  if (!connectionString) {
    return undefined;
  }

  pool ??= new Pool({
    connectionString,
    ssl: connectionString.includes("sslmode=require")
      ? { rejectUnauthorized: false }
      : undefined,
  });

  return pool;
}
