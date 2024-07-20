import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 } from "uuid";

export const relationTypesTable = sqliteTable("relation_types", {
  id: text("id")
    .primaryKey()
    .$default(() => v4()),
  name: text("name").notNull(),
  chapter: text("chapter"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(current_timestamp)`)
    .$onUpdate(() => sql`(current_timestamp)`),
});

export type InsertRelation = typeof relationTypesTable.$inferInsert;
export type SelectRelation = typeof relationTypesTable.$inferSelect;
