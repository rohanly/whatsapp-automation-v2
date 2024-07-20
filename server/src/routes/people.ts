import { Hono } from "hono";
import { db } from "~/db";
import { eq, relations } from "drizzle-orm";
import { peopleTable, SelectPeople } from "~/models/people";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
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
      const people: any = await db.query.people.findMany({
        with: {
          relations: true,
        },
        limit: limit,
        offset: page,
      });

      // Return response without additional nesting
      return c.json({ data: people, pagination: { page, limit } });
    } catch (error) {
      console.log("ERROR: ", error);
      return c.json({ message: "Failed to retrieve people", error }, 500);
    }
  }
);

peopleRouter.get("/:id", async (c) => {
  const id = c.req.param("id");

  try {
    // Retrieve person
    const person = await db.query.people.findFirst({
      where: eq(peopleTable.id, id),
      with: {
        relationType: true,
      },
    });

    if (!person) {
      return c.json({ message: "Person not found" }, 404);
    }

    // Return response
    return c.json({
      data: person,
    });
  } catch (error) {
    console.error("Failed to retrieve person", error);
    return c.json({ message: "Failed to retrieve person", error }, 500);
  }
});

peopleRouter.post("/", async (c) => {
  try {
    const data = await c.req.json();

    const person = await db.insert(peopleTable).values(data).returning();

    return c.json({ data: person });
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
