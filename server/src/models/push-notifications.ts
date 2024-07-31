import { relations, sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 } from "uuid";
import { usersTable } from "./users";

export const pushNotificationsTable = sqliteTable("push_notifications", {
  id: text("id")
    .primaryKey()
    .$default(() => v4()),
  subscription: text("subscription", { mode: "json" }).notNull(),
  userId: text("user_id")
    .references(() => usersTable.id, {
      onDelete: "cascade",
    })
    .notNull(),
  browserMeta: text("browser_meta", { mode: "json" }),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(current_timestamp)`)
    .$onUpdate(() => sql`(current_timestamp)`),
});

export type SelectPushNotification = typeof pushNotificationsTable.$inferSelect;

export const pushNotificationsRelations = relations(
  pushNotificationsTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [pushNotificationsTable.userId],
      references: [usersTable.id],
    }),
  })
);
