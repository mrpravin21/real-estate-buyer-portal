import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

function withSafeStatementTimeout(url: string) {
  try {
    const parsed = new URL(url);
    const current = parsed.searchParams.get("options");
    if (!current) {
      parsed.searchParams.set("options", "-c statement_timeout=10000");
      return parsed.toString();
    }
    if (!current.includes("statement_timeout")) {
      parsed.searchParams.set(
        "options",
        `${current} -c statement_timeout=10000`
      );
    }
    return parsed.toString();
  } catch {
    return url;
  }
}

const client = postgres(withSafeStatementTimeout(connectionString), {
  max: 5,
  prepare: false,
  connect_timeout: 10,
});

export const db = drizzle(client, { schema });
