import { Hono } from "hono";
import { db } from "~/db";
import { eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { peopleRelationsTable } from "~/models/people-relations";

export const peopleRelationsRouter = new Hono();

peopleRelationsRouter.post("/", async (c) => {
  const relation = await c.req.json();
  try {
    const result = await db
      .insert(peopleRelationsTable)
      .values(relation)
      .returning();
    return c.json(result);
  } catch (error) {
    return c.json({ message: "Relation creation failed", error }, 500);
  }
});

peopleRelationsRouter.get(
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
      const relation = await db.query.peopleRelationsTable.findMany({
        with: {
          person: true,
          relationType: true,
        },
        limit: limit,
        offset: page * limit,
      });

      if (relation) {
        return c.json(relation);
      } else {
        return c.json({ message: "Relation not found" }, 404);
      }
    } catch (error) {
      console.log("ERROR: ", error);
      return c.json({ message: "Failed to retrieve relation", error }, 500);
    }
  }
);

peopleRelationsRouter.get("/:id", async (c) => {
  const id = c.req.param("id");
  try {
    const relation = await db.query.peopleRelationsTable.findFirst({
      with: {
        person: true,
        relationType: true,
      },
      where: eq(peopleRelationsTable.id, id),
    });

    if (relation) {
      return c.json(relation);
    } else {
      return c.json({ message: "Relation not found" }, 404);
    }
  } catch (error) {
    return c.json({ message: "Failed to retrieve relation", error }, 500);
  }
});

peopleRelationsRouter.patch("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  try {
    const person = await db
      .update(peopleRelationsTable)
      .set(body)
      .where(eq(peopleRelationsTable.id, id))
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

peopleRelationsRouter.delete("/:id", async (c) => {
  const id = c.req.param("id");
  try {
    const person = await db
      .delete(peopleRelationsTable)
      .where(eq(peopleRelationsTable.id, id))
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
