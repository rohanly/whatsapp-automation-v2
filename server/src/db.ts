import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { config } from "dotenv";
import { peopleTable, peopleToRelations } from "./models/people";
import { relationTypesTable } from "./models/relation-types";
import { eventRelations, eventsTable } from "./models/events";
import { eventTypesTable } from "./models/event-types";
import { templatesTable } from "./models/templates";
import { messagesTable } from "./models/messages";
import {
  peopleRelations,
  peopleRelationsTable,
} from "./models/people-relations";

config({ path: ".env" });

const sqlite = new Database("database.db");
export const db = drizzle(sqlite, {
  schema: {
    peopleTable,
    peopleRelationsTable,
    relationTypesTable,
    eventsTable,
    eventTypesTable,
    templatesTable,
    messagesTable,
    peopleRelations,
    peopleToRelations,
    eventRelations,
  },
});
export type DatabaseType = typeof db;
