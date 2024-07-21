import { relations, sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { v4 } from "uuid";
import { peopleTable } from "./people";
import { eventTypesTable } from "./event-types";
import { templatesTable } from "./templates";

export const eventsTable = sqliteTable("events", {
  id: text("id")
    .primaryKey()
    .$default(() => v4()),
  name: text("name"),
  date: text("date"),
  personId: text("person").references(() => peopleTable.id, {
    onDelete: "cascade",
  }),
  everyYear: integer("every_year", { mode: "boolean" }),
  eventTypeId: text("type").references(() => eventTypesTable.id),
  messageCount: integer("message_count"),
  additionalInfo: text("additional_info"),
  templateId: text("template").references(() => templatesTable.id),

  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(current_timestamp)`)
    .$onUpdate(() => sql`(current_timestamp)`),
});

export const eventRelations = relations(eventsTable, ({ one }) => ({
  person: one(peopleTable, {
    fields: [eventsTable.personId],
    references: [peopleTable.id],
  }),

  eventType: one(eventTypesTable, {
    fields: [eventsTable.eventTypeId],
    references: [eventTypesTable.id],
  }),
}));
