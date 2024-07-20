import { HonoDiskStorage } from "@hono-storage/node-disk";

export const storage = new HonoDiskStorage({
  dest: "./uploads",
  filename: (c, file) =>
    `${file.originalname}-${new Date().getTime()}.${file.extension}`,
});
