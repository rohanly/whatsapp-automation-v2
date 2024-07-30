import { formatDate } from "@/utils/date";
import { z } from "zod";

export const personFormSchema = z.object({
  name: z.string().min(2),
  dateOfBirth: z.date().transform(formatDate),
  salutation: z.string().optional(),
  relation: z
    .array(
      z.object({
        id: z.string(),
      })
    )
    .transform((data) => data.map((d) => d.id)),
  gender: z.string(),
  email: z.string().optional(),
  image: z.any().nullable(),
  mobile: z
    .string()
    // .length(10, "Mobile number should be of 10 digits")
    .optional()
    .nullable(),
  extendedFamily: z.boolean().optional().nullable(),
  company: z.string().optional().nullable(),
  socialLink: z.string().optional().nullable(),
  ex: z.boolean().optional().nullable(),
  metaData: z.object({}).optional().nullable(),
  additionalInfo: z.string().optional().nullable(),
});

export type FormFields = z.infer<typeof personFormSchema>;

export const editPersonFormSchema = personFormSchema.partial();
