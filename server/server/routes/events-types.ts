import CrudRouter from "@/utils/crud-router";
import { z } from "zod";
import { EventTable, eventTypesTable } from "../models/event-types";
import { db } from "../db";

// Define create and update schemas for event_types table
const createEventTypeSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
});

const updateEventTypeSchema = createEventTypeSchema.partial();

export const eventTypesRouter = new CrudRouter({
  table: eventTypesTable,
  tableName: "event_types",
  db: db,
  createSchema: createEventTypeSchema,
  updateSchema: updateEventTypeSchema,
});

// Example of adding a custom route
eventTypesRouter.addCustomRoute("get", "/custom", async (c) => {
  return c.json({ message: "This is a custom route for event_types" });
});
