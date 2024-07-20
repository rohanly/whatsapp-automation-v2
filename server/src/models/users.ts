import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 } from "uuid";

export const usersTable = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .$default(() => v4()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(current_timestamp)`)
    .$onUpdate(() => sql`(current_timestamp)`),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;
