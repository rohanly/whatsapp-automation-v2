import CrudRouter from "~/utils/crud-router";
import { Hono } from "hono";
import { z } from "zod";
import { eventsTable } from "~/models/events";
import { db } from "~/db";
import { eventTypesTable } from "~/models/event-types";
import { peopleTable } from "~/models/people";

const createEventSchema = z.object({
  name: z.string().optional(),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  personId: z.string(),
  everyYear: z.boolean().default(false),
  type: z.string().optional(),
  messageCount: z.number().optional(),
  additionalInfo: z.string().optional(),
  template: z.string().optional(),
  eventTypeId: z.string(),
});

const updateEventSchema = createEventSchema.partial();

export const eventsRouter = new CrudRouter({
  table: eventsTable,
  tableName: "events",
  db: db,
  createSchema: createEventSchema,
  updateSchema: updateEventSchema,
  references: {
    eventType: {
      table: eventTypesTable,
      foreignKey: "eventTypeId",
    },
    person: {
      table: peopleTable,
      foreignKey: "personId",
    },
  },
});

// Example of adding a custom route
eventsRouter.addCustomRoute("get", "/custom", async (c) => {
  return c.json({ message: "This is a custom route for events" });
});
