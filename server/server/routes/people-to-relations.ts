import { Hono } from "hono";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { peopleToRelationTypeTable } from "@/server/models/people-to-relation-types";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { peopleTable } from "../models/people";
import { relationTypesTable } from "../models/relation-types";

const router = new Hono();

export const peopleRelationRouter = router;

router.post("/", async (c) => {
  const relation = await c.req.json();
  try {
    const result = await db
      .insert(peopleToRelationTypeTable)
      .values(relation)
      .returning();
    return c.json(result);
  } catch (error) {
    return c.json({ message: "Relation creation failed", error }, 500);
  }
});

router.get(
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
      const relation = await db
        .select()
        .from(peopleToRelationTypeTable)
        .leftJoin(
          peopleTable,
          eq(peopleToRelationTypeTable.personId, peopleTable.id)
        )
        .leftJoin(
          relationTypesTable,
          eq(peopleToRelationTypeTable.relationTypeId, relationTypesTable.id)
        )
        .groupBy(peopleTable.id)
        .limit(limit)
        .offset(page * limit);

      if (relation) {
        return c.json(relation);
      } else {
        return c.json({ message: "Relation not found" }, 404);
      }
    } catch (error) {
      return c.json({ message: "Failed to retrieve relation", error }, 500);
    }
  }
);

router.get("/:id", async (c) => {
  const id = c.req.param("id");
  try {
    const relation = await db
      .select()
      .from(peopleToRelationTypeTable)
      .where(eq(peopleToRelationTypeTable.id, id))
      .limit(1);

    if (relation) {
      return c.json(relation);
    } else {
      return c.json({ message: "Relation not found" }, 404);
    }
  } catch (error) {
    return c.json({ message: "Failed to retrieve relation", error }, 500);
  }
});
