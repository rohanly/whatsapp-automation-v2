import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 } from "uuid";
import { usersTable } from "./users";

export const sessionsTable = sqliteTable("sessions", {
  id: text("id")
    .primaryKey()
    .$default(() => v4()),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id),
  expiresAt: text("expires_at").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(current_timestamp)`)
    .$onUpdate(() => sql`(current_timestamp)`),
});

export type InsertSession = typeof sessionsTable.$inferInsert;
export type SelectSession = typeof sessionsTable.$inferSelect;
