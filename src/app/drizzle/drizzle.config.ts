import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" }); 

export default defineConfig({
  schema: "./src/app/db/schema.ts",   
  out: "./drizzle",               
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://postgres.kihsinkzpucwnhrcjntk:MCOHackathon@2025@aws-0-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true",
    ssl: { rejectUnauthorized: false } 
  }
});
