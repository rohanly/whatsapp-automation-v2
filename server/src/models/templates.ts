import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 } from "uuid";
import { eventTypesTable } from "./event-types";
import { relations, sql } from "drizzle-orm";

export const templatesTable = sqliteTable("templates", {
  id: text("id")
    .primaryKey()
    .$default(() => v4()),
  image: text("image"),
  message: text("message"),
  eventTypeId: text("type").references(() => eventTypesTable.id),
  name: text("name"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(current_timestamp)`)
    .$onUpdate(() => sql`(current_timestamp)`),
});

export const templateRelations = relations(templatesTable, ({ one }) => ({
  eventType: one(eventTypesTable, {
    fields: [templatesTable.eventTypeId],
    references: [eventTypesTable.id],
  }),
}));
