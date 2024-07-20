import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 } from "uuid";
import { eventTypesTable } from "./event-types";
import { sql } from "drizzle-orm";

// Assuming you have the `eventTypesTable` defined
export const templatesTable = sqliteTable("templates", {
  id: text("id")
    .primaryKey()
    .$default(() => v4()),

  image: text("image"), // Assuming file path or URL stored as text

  message: text("message"), // Assuming editor content stored as text

  eventTypeId: text("type").references(() => eventTypesTable.id), // Relation to `eventTypesTable`

  name: text("name"),

  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(current_timestamp)`)
    .$onUpdate(() => sql`(current_timestamp)`),
});
