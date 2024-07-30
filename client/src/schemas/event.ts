import { formatDate } from "@/utils/date";
import { z } from "zod";

export const eventFormSchema = z.object({
  name: z.string().min(2),
  date: z.date().transform(formatDate),
  personId: z.string(),
  eventTypeId: z.string(),
  templateId: z.string().optional(),
  meta_data: z.object({}).optional(),
  additional_info: z.string().optional(),
  // message_count: z.number().optional().default(0),
});

export type FormFields = z.infer<typeof eventFormSchema>;
