import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 } from "uuid";
import { peopleTable } from "./people";
import { relationTypesTable } from "./relation-types";

export const peopleRelationsTable = sqliteTable("people_relations", {
  id: text("id")
    .primaryKey()
    .$default(() => v4()),
  personId: text("person").references(() => peopleTable.id, {
    onDelete: "cascade",
  }),
  relationTypeId: text("relation").references(() => relationTypesTable.id),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(current_timestamp)`)
    .$onUpdate(() => sql`(current_timestamp)`),
});

export const peopleRelations = relations(peopleRelationsTable, ({ one }) => ({
  person: one(peopleTable, {
    fields: [peopleRelationsTable.personId],
    references: [peopleTable.id],
  }),

  relationType: one(relationTypesTable, {
    fields: [peopleRelationsTable.relationTypeId],
    references: [relationTypesTable.id],
  }),
}));
