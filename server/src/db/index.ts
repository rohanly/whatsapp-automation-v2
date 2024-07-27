import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { config } from "dotenv";
import { peopleTable, peopleToRelations } from "~/models/people";
import { relationTypesTable } from "~/models/relation-types";
import { eventRelations, eventsTable } from "~/models/events";
import { eventTypesTable } from "~/models/event-types";
import { templateRelations, templatesTable } from "~/models/templates";
import { messageRelations, messagesTable } from "~/models/messages";
import {
  peopleRelations,
  peopleRelationsTable,
} from "~/models/people-relations";
import { usersTable } from "~/models/users";
import { sessionsTable } from "~/models/sessions";

config({ path: ".env" });

export const sqlite = new Database("database.db");
export const db = drizzle(sqlite, {
  schema: {
    usersTable,
    sessionsTable,
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
    templateRelations,
    messageRelations,
  },
});
export type DatabaseType = typeof db;
