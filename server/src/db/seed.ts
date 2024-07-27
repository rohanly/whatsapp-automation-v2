import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { config } from "dotenv";
import { eventTypesTable } from "~/models/event-types";
import { relationTypesTable } from "~/models/relation-types";

config({ path: ".env" });

const eventTypesData = [
  { name: "Birthday" },
  { name: "Work Anniversary" },
  { name: "Independence Day" },
  { name: "Foundation Day" },
];
const relationTypesData = [
  { name: "Lemon" },
  { name: "BNI" },
  { name: "Ex Lemon" },
  { name: "Friend" },
];

async function main() {
  const sqlite = new Database("database.db");
  const db = drizzle(sqlite);

  console.log("-------------Seed start-------------");

  Promise.allSettled([
    db.insert(eventTypesTable).values(eventTypesData), // Add event types
    db.insert(relationTypesTable).values(relationTypesData), // Add relations types
  ]);

  console.log("-------------Seed done-------------");
}

main();
