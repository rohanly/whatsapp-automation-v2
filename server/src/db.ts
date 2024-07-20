import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { config } from "dotenv";
import { peopleTable } from "./models/people";
import { relationTypesTable } from "./models/relation-types";
import { eventsTable } from "./models/events";
import { eventTypesTable } from "./models/event-types";
import { templatesTable } from "./models/templates";
import { messagesTable } from "./models/messages";

config({ path: ".env" });

const sqlite = new Database("database.db");
export const db = drizzle(sqlite, {
  schema: {
    people: peopleTable,
    relationTypes: relationTypesTable,
    events: eventsTable,
    eventTypes: eventTypesTable,
    templates: templatesTable,
    messages: messagesTable,
  },
});
export type DatabaseType = typeof db;
