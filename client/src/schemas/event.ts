import { z } from "zod";

export const eventFormSchema = z.object({
  name: z.string().min(2),
  type: z.string(),
  date: z.date(),
  person: z.string(),
  template: z.string().optional(),
  meta_data: z.object({}).optional(),
  additional_info: z.string().optional(),
  message_count: z.number().optional().default(0),
});

export type FormFields = z.infer<typeof eventFormSchema>;
