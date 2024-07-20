import { Hono } from "hono";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { peopleTable, SelectPeople } from "@/server/models/people";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { peopleToRelationTypeTable } from "../models/people-to-relation-types";
import { relationTypesTable } from "../models/relation-types";

export const peopleRouter = new Hono();

peopleRouter.get(
  "/",
  zValidator(
    "query",
    z.object({
      page: z.coerce.number().nonnegative().optional().default(0),
      limit: z.coerce.number().nonnegative().optional().default(10),
    })
  ),
  async (c) => {
    const { limit, page } = c.req.valid("query");

    try {
      // Retrieve paginated people data with relations
      const people: any = await db
        .select()
        .from(peopleTable)
        .limit(limit)
        .offset(page * limit);

      // Fetch relations for each person
      for (let person of people) {
        const personId = person.id;
        const personRelations = await db
          .select({ relation: relationTypesTable }) // Assuming relationTypesTable has a method to get its columns
          .from(peopleToRelationTypeTable)
          .leftJoin(
            relationTypesTable,
            eq(peopleToRelationTypeTable.relationTypeId, relationTypesTable.id)
          )
          .where(eq(peopleToRelationTypeTable.personId, personId));

        person.relations = personRelations.map((relation) => relation.relation);
      }

      // Return response without additional nesting
      return c.json({ data: people, pagination: { page, limit } });
    } catch (error) {
      console.error("Failed to retrieve people", error);
      return c.json({ message: "Failed to retrieve people", error }, 500);
    }
  }
);

peopleRouter.get("/:id", async (c) => {
  const id = c.req.param("id");

  try {
    // Retrieve person
    const person = await db
      .select()
      .from(peopleTable)
      .where(eq(peopleTable.id, id))
      .limit(1);

    if (person.length === 0) {
      return c.json({ message: "Person not found" }, 404);
    }

    // Retrieve relations
    const relations = await db
      .select({
        relations: relationTypesTable,
      })
      .from(peopleToRelationTypeTable)
      .leftJoin(
        relationTypesTable,
        eq(peopleToRelationTypeTable.relationTypeId, relationTypesTable.id)
      )
      .where(eq(peopleToRelationTypeTable.personId, id));

    // Return response
    return c.json({
      ...person[0],
      relations: relations.map((relation) => relation.relations),
    });
  } catch (error) {
    console.error("Failed to retrieve person", error);
    return c.json({ message: "Failed to retrieve person", error }, 500);
  }
});

peopleRouter.post("/", async (c) => {
  try {
    const { relations, ...personData } = await c.req.json();

    const person = await db.insert(peopleTable).values(personData).returning();

    const peopleRelations = [];

    for (const relation of relations) {
      const result = await db
        .insert(peopleToRelationTypeTable)
        .values({
          personId: person?.id,
          relationTypeId: relation,
        })
        .returning();

      peopleRelations.push(result);
    }

    return c.json({ ...person, relations: peopleRelations });
  } catch (error) {
    return c.json({ message: "Person creation failed", error }, 500);
  }
});

peopleRouter.patch("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  try {
    const person = await db
      .update(peopleTable)
      .set(body)
      .where(eq(peopleTable.id, id))
      .returning();

    if (person) {
      return c.json(person);
    } else {
      return c.json({ message: "Person not found" }, 404);
    }
  } catch (error) {
    return c.json({ message: "Failed to retrieve person", error }, 500);
  }
});
