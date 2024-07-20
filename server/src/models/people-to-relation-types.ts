import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 } from "uuid";
import { peopleTable } from "./people";
import { relationTypesTable } from "./relation-types";

export const peopleToRelationTypeTable = sqliteTable(
  "people_to_relation_types",
  {
    id: text("id")
      .primaryKey()
      .$default(() => v4()),

    personId: text("person_id").notNull(),
    relationTypeId: text("relation_type_id").notNull(),

    createdAt: text("created_at")
      .notNull()
      .default(sql`(current_timestamp)`),
    updatedAt: text("updated_at")
      .notNull()
      .default(sql`(current_timestamp)`)
      .$onUpdate(() => sql`(current_timestamp)`),
  }
);

export const tableRelations = relations(
  peopleToRelationTypeTable,
  ({ one }) => ({
    person: one(peopleTable, {
      relationName: "person",
      fields: [peopleToRelationTypeTable.personId],
      references: [peopleTable.id],
    }),
    relationType: one(relationTypesTable, {
      relationName: "relationType",
      fields: [peopleToRelationTypeTable.relationTypeId],
      references: [relationTypesTable.id],
    }),
  })
);

export type InsertRelation = typeof peopleToRelationTypeTable.$inferInsert;
export type SelectRelation = typeof peopleToRelationTypeTable.$inferSelect;
