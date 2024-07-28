import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { config } from "dotenv";

import * as schema from "~/models";

config({ path: ".env" });

export const sqlite = new Database("database.db");
export const db = drizzle(sqlite, {
  schema: schema,
});
export type DatabaseType = typeof db;
