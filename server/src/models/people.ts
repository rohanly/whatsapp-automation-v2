import { relations, sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { v4 } from "uuid";

export const peopleTable = sqliteTable("people", {
  id: text("id")
    .primaryKey()
    .$default(() => v4()),
  name: text("name").notNull(),
  dateOfBirth: text("date_of_birth"),
  salutation: text("salutation"),
  metaData: text("meta_data", { mode: "json" }),
  additionalInfo: text("additional_info"),
  image: text("image"),
  email: text("email"),
  gender: text("gender", { enum: ["male", "female", "other"] }).notNull(),
  mobile: text("mobile"),
  extendedFamily: integer("extended_family", { mode: "boolean" }),
  familyRelation: text("family_relation"),
  company: text("company"),
  socialLink: text("social_link"),
  ex: integer("ex", { mode: "boolean" }),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(current_timestamp)`)
    .$onUpdate(() => sql`(current_timestamp)`),
});

export type InsertPeople = typeof peopleTable.$inferInsert;
export type SelectPeople = typeof peopleTable.$inferSelect;
