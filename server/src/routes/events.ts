import { Hono } from "hono";
import { db } from "~/db";
import { and, between, count, eq, SQL, sql } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { eventsTable } from "~/models/events";
import { SelectTemplate, templatesTable } from "~/models/templates";
import { InsertMessage, messagesTable } from "~/models/messages";
import { getRandomIndex, parseTemplate } from "~/utils/templates.utils";
import { CanvasService } from "~/services/canvas/generate-template";
import { createPrivateRouter } from "~/builder";

export const eventsRouter = createPrivateRouter();

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

eventsRouter.get("/", async (c) => {
  let { pageIndex, pageSize, startDate, endDate } = c.req.query() as any;

  pageIndex = parseInt(pageIndex) || 1;
  pageSize = parseInt(pageSize) || 10;
  endDate = endDate ?? startDate;

  const filters: SQL[] = [];

  if (startDate) {
    filters.push(between(eventsTable.date, startDate, endDate));
  }

  const pageCountResult = await db
    .select({ totalRows: count() })
    .from(eventsTable)
    .where(and(...filters));

  const { totalRows } = pageCountResult[0];

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
      where: and(...filters),
      limit: pageSize,
      offset: (pageIndex - 1) * pageSize,
    });

    // Return response without additional nesting
    return c.json({
      data: people,
      pagination: {
        pageIndex: pageIndex,
        pageSize,
        totalRows,
        totalPage: Math.ceil(totalRows / pageSize),
      },
    });
  } catch (error) {
    console.log("ERROR: ", error);
    return c.json({ message: "Failed to retrieve people", error }, 500);
  }
});

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

eventsRouter.post("/:id/generate_message", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();

    // Retrieve event
    const event = await db.query.eventsTable.findFirst({
      where: eq(eventsTable.id, id),
      with: {
        person: true,
      },
    });

    if (!event) {
      return c.json({ message: "Event not found" }, 404);
    }

    let template: SelectTemplate | undefined;

    // set the template
    if (event.templateId) {
      template = await db.query.templatesTable.findFirst({
        where: eq(templatesTable.eventTypeId, event.eventTypeId as string),
      });
    } else {
      const templates = await db.query.templatesTable.findMany({
        where: eq(templatesTable.eventTypeId, event.eventTypeId as string),
      });

      // select a random template
      template = templates[getRandomIndex(templates.length)];
    }

    const generatedImage = await CanvasService.generateTemplateImage(
      template!,
      event.person?.name || ""
    );

    console.log("GENERATED IMAGE PATH: ", generatedImage);

    const message: InsertMessage = {
      eventId: id,
      receiptId: event.personId,
      sent: false,
      templateId: template?.id,
      message: parseTemplate(template?.message || "", event.person),
      image: generatedImage,
    };

    const record = await db.insert(messagesTable).values(message).returning();

    return c.json(record[0]);
  } catch (error) {
    console.log("ERROR", error);
    return c.json({ message: "Failed to retrieve event", error }, 500);
  }
});
