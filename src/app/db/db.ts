import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: "postgresql://postgres.kihsinkzpucwnhrcjntk:MCOHackathon@2025@aws-0-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true",
  ssl: { rejectUnauthorized: false }, 
  max: 100,
  idleTimeoutMillis: 30000, 
});

export const db = drizzle(pool);