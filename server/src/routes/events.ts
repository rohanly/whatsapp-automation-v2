import { Hono } from "hono";
import { db } from "~/db";
import { eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { eventsTable } from "~/models/events";

export const eventsRouter = new Hono();

eventsRouter.post("/", async (c) => {
  try {
    const data = await c.req.json();

    const event = await db.insert(eventsTable).values(data).returning();

    return c.json({ data: event });
  } catch (error) {
    console.log("ERROR : ", error);
    return c.json({ message: "Event creation failed", error }, 500);
  }
});

eventsRouter.get(
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
      const people: any = await db.query.eventsTable.findMany({
        with: {
          person: {
            with: {
              relations: {
                with: {
                  relationType: true,
                },
              },
            },
          },
          eventType: true,
        },
        limit: limit,
        offset: page * limit,
      });

      // Return response without additional nesting
      return c.json({ data: people, pagination: { page, limit } });
    } catch (error) {
      console.log("ERROR: ", error);
      return c.json({ message: "Failed to retrieve people", error }, 500);
    }
  }
);

eventsRouter.get("/:id", async (c) => {
  const id = c.req.param("id");

  try {
    // Retrieve event
    const event = await db.query.eventsTable.findFirst({
      where: eq(eventsTable.id, id),
      with: {
        person: {
          with: {
            relations: {
              with: {
                relationType: true,
              },
            },
          },
        },
        eventType: true,
      },
    });

    if (!event) {
      return c.json({ message: "Person not found" }, 404);
    }

    // Return response
    return c.json({
      data: event,
    });
  } catch (error) {
    console.error("Failed to retrieve event", error);
    return c.json({ message: "Failed to retrieve event", error }, 500);
  }
});

eventsRouter.patch("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  try {
    const event = await db
      .update(eventsTable)
      .set(body)
      .where(eq(eventsTable.id, id))
      .returning();

    if (event) {
      return c.json(event);
    } else {
      return c.json({ message: "Person not found" }, 404);
    }
  } catch (error) {
    return c.json({ message: "Failed to retrieve event", error }, 500);
  }
});

eventsRouter.delete("/:id", async (c) => {
  const id = c.req.param("id");
  try {
    const event = await db
      .delete(eventsTable)
      .where(eq(eventsTable.id, id))
      .returning();

    if (event) {
      return c.json(event);
    } else {
      return c.json({ message: "Person not found" }, 404);
    }
  } catch (error) {
    return c.json({ message: "Failed to retrieve event", error }, 500);
  }
});
