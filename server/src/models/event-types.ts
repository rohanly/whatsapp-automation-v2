import { sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 } from "uuid";

export const eventTypesTable = sqliteTable("event_types", {
  id: text("id")
    .primaryKey()
    .$default(() => v4()),
  name: text("name"),
  description: text("description"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(current_timestamp)`)
    .$onUpdate(() => sql`(current_timestamp)`),
});

export type EventTable = typeof eventTypesTable.$inferSelect;
