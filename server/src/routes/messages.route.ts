import { Hono } from "hono";
import { db } from "~/db";
import { eq } from "drizzle-orm";
import { messagesTable } from "~/models/messages";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { storage } from "~/storage";
import { createPrivateRouter } from "~/builder";

export const messageRouter = createPrivateRouter();

messageRouter.post("/", storage.single("image"), async (c) => {
  try {
    const body: any = await c.req.parseBody();
    body.image = (c.var as any).imageUrl;
    const message = await db.insert(messagesTable).values(body).returning();

    return c.json(message[0]);
  } catch (error) {
    console.log("ERR: ", error);
    return c.json({ message: "Failed to send the messages", error }, 500);
  }
});

messageRouter.get(
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
      const people: any = await db.query.messagesTable.findMany({
        with: {
          event: {
            with: {
              eventType: true,
            },
          },

          receipt: true,
          template: true,
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

messageRouter.get("/:id", async (c) => {
  const id = c.req.param("id");

  try {
    // Retrieve person
    const person = await db.query.messagesTable.findFirst({
      where: eq(messagesTable.id, id),
      with: {
        event: {
          with: {
            eventType: true,
          },
        },

        receipt: true,
        template: true,
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

messageRouter.patch("/:id", storage.single("image"), async (c) => {
  const id = c.req.param("id");
  const body: any = await c.req.parseBody();
  if (c.var.imageUrl) {
    body.image = c.var.imageUrl;
  }

  try {
    const person = await db
      .update(messagesTable)
      .set(body)
      .where(eq(messagesTable.id, id))
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

messageRouter.delete("/:id", async (c) => {
  const id = c.req.param("id");
  try {
    const person = await db
      .delete(messagesTable)
      .where(eq(messagesTable.id, id))
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
