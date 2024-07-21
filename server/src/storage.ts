import { HonoDiskStorage } from "@hono-storage/node-disk";

export const storage = new HonoDiskStorage({
  dest: "./public/uploads",
  filename: (c, file) => {
    const filename = `${file.originalname.replace(
      " ",
      "-"
    )}-${new Date().getTime()}.${file.extension}`;
    c.set("imageUrl", "/uploads/" + filename);

    return filename;
  },
});
