import "dotenv/config";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { db } from ".";

function main() {
  migrate(db, { migrationsFolder: "../migrations" });
}

main();
