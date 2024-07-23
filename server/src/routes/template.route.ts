import { Hono } from "hono";
import { db } from "~/db";
import { eq } from "drizzle-orm";
import { templatesTable } from "~/models/templates";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { storage } from "~/storage";

export const templateRouter = new Hono();

templateRouter.post("/", storage.single("image"), async (c) => {
  try {
    const body: any = await c.req.parseBody();
    body.image = (c.var as any).imageUrl;

    const person = await db.insert(templatesTable).values(body).returning();

    return c.json(person[0]);
  } catch (error) {
    return c.json({ message: "Person creation failed", error }, 500);
  }
});

templateRouter.get(
  "/",
  zValidator(
    "query",
    z.object({
      page: z.coerce.number().nonnegative().optional().default(1),
      limit: z.coerce.number().nonnegative().optional().default(10),
    })
  ),
  async (c) => {
    const { limit, page } = c.req.valid("query");

    try {
      // Retrieve paginated people data with relations
      const people: any = await db.query.templatesTable.findMany({
        with: {
          eventType: true,
        },

        limit: limit,
        offset: (page - 1) * limit,
      });

      // Return response without additional nesting
      return c.json({ data: people, pagination: { page, limit } });
    } catch (error) {
      console.log("ERROR: ", error);
      return c.json({ message: "Failed to retrieve people", error }, 500);
    }
  }
);

templateRouter.get("/:id", async (c) => {
  const id = c.req.param("id");

  try {
    // Retrieve person
    const person = await db.query.templatesTable.findFirst({
      where: eq(templatesTable.id, id),
      with: {
        eventType: true,
      },
    });

    if (!person) {
      return c.json({ message: "Person not found" }, 404);
    }

    // Return response
    return c.json(person);
  } catch (error) {
    console.error("Failed to retrieve person", error);
    return c.json({ message: "Failed to retrieve person", error }, 500);
  }
});

templateRouter.patch("/:id", storage.single("image"), async (c) => {
  const id = c.req.param("id");
  const body: any = await c.req.parseBody();
  //@ts-expect-error
  if (c.var.imageUrl) {
    body.image = (c.var as any).imageUrl;
  }

  try {
    const person = await db
      .update(templatesTable)
      .set(body)
      .where(eq(templatesTable.id, id))
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

templateRouter.delete("/:id", async (c) => {
  const id = c.req.param("id");
  try {
    const person = await db
      .delete(templatesTable)
      .where(eq(templatesTable.id, id))
      .returning();

    if (person) {
      return c.json(person);
    } else {
      return c.json({ message: "Person not found" }, 404);
    }
  } catch (error) {
    console.log("ERROR: ", error);
    return c.json({ message: "Failed to retrieve person", error }, 500);
  }
});
