import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { v4 } from "uuid";
import { eventTypesTable } from "./event-types";
import { templatesTable } from "./templates";
import { peopleTable } from "./people";
import { sql } from "drizzle-orm";

export const messagesTable = sqliteTable("messages", {
  id: text("id")
    .primaryKey()
    .$default(() => v4()),

  image: text("image"),
  message: text("message"),
  eventTypeId: text("event_type").references(() => eventTypesTable.id), // Relation to `eventTypesTable`
  sent: integer("sent", { mode: "boolean" }),
  templateId: text("template").references(() => templatesTable.id), // Relation to `templatesTable`
  receiptId: text("receipt").references(() => peopleTable.id), // Relation to `receiptsTable`
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(current_timestamp)`)
    .$onUpdate(() => sql`(current_timestamp)`),
});
