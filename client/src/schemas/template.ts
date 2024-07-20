import { z } from "zod";
const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const templateSchema = z.object({
  image: z.any(),
  message: z.string().optional(),
  type: z.string(),
});

export type TemplateSchema = z.infer<typeof templateSchema>;
