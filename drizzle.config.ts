import { config as loadEnv } from "dotenv";
import { defineConfig } from "drizzle-kit";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

/**
 * Drizzle Kit introspection can crash on some hosted Postgres setups (e.g. Supabase)
 * when using certain pooler URLs. If `npm run db:push` fails with
 * `checkValue.replace` / `undefined`, set DIRECT_DATABASE_URL to the **direct**
 * Postgres URI (Supabase: port 5432, "direct connection" in dashboard) and keep
 * DATABASE_URL as the pooler for the Next.js app.
 */
const url =
  process.env.DIRECT_DATABASE_URL?.trim() || process.env.DATABASE_URL?.trim();

if (!url) {
  throw new Error(
    "Set DATABASE_URL in .env.local (and optionally DIRECT_DATABASE_URL for drizzle-kit). See README."
  );
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url,
  },
});
