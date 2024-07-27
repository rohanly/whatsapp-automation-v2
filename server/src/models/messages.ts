import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { v4 } from "uuid";
import { templatesTable } from "./templates";
import { peopleTable } from "./people";
import { relations, sql } from "drizzle-orm";
import { eventsTable } from "./events";

export const messagesTable = sqliteTable("messages", {
  id: text("id")
    .primaryKey()
    .$default(() => v4()),

  image: text("image"),
  message: text("message"),
  eventId: text("eventId").references(() => eventsTable.id),
  sent: integer("sent", { mode: "boolean" }),
  templateId: text("template").references(() => templatesTable.id),
  receiptId: text("receipt").references(() => peopleTable.id),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(current_timestamp)`)
    .$onUpdate(() => sql`(current_timestamp)`),
});

export const messageRelations = relations(messagesTable, ({ one }) => ({
  receipt: one(peopleTable, {
    fields: [messagesTable.receiptId],
    references: [peopleTable.id],
  }),

  event: one(eventsTable, {
    fields: [messagesTable.eventId],
    references: [eventsTable.id],
  }),

  template: one(templatesTable, {
    fields: [messagesTable.templateId],
    references: [templatesTable.id],
  }),
}));

export type InsertMessage = typeof messagesTable.$inferInsert;
export type SelectMessage = typeof messagesTable.$inferSelect;
