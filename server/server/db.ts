import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { config } from "dotenv";

config({ path: ".env" });

const sqlite = new Database("database.db");
export const db = drizzle(sqlite);
export type DatabaseType = typeof db;
