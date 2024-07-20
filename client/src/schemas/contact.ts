import { z } from "zod";

export const contactFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(2).max(12),
});

export type FormFields = z.infer<typeof contactFormSchema>;
