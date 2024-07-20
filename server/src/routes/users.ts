import { Hono } from "hono";
import fs from "fs/promises";
import { db } from "~/db";
import { storage } from "~/storage";
import { usersTable } from "../models/users";
import { eq } from "drizzle-orm";

export const userRouter = new Hono();

userRouter.post("/", async (c) => {
  const user = await c.req.json();
  try {
    const result = await db.insert(usersTable).values(user).returning();
    return c.json({ message: "User created successfully", user: result });
  } catch (error) {
    return c.json({ message: "User creation failed", error }, 500);
  }
});

// userRouter.post("/users/:id/avatar", storage.single("avatar"), async (c) => {
//   const id = c.req.param("id");
//   const file = c.req.file;

//   if (!file) {
//     return c.json({ message: "No file uploaded" }, 400);
//   }

//   try {
//     const buffer = await fs.readFile(file.path);

//     await db
//       .update(db.schema.users)
//       .set({ avatar: buffer })
//       .where(db.schema.users.id.eq(Number(id)));

//     return c.json({ message: "Avatar uploaded successfully", file });
//   } catch (error) {
//     return c.json({ message: "Avatar upload failed", error }, 500);
//   }
// });

userRouter.get("/:id", async (c) => {
  const id = c.req.param("id");
  const { limit = 10, offset = 1 } = c.req.query();
  try {
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id));

    if (user) {
      return c.json(user);
    } else {
      return c.json({ message: "User not found" }, 404);
    }
  } catch (error) {
    return c.json({ message: "Failed to retrieve user", error }, 500);
  }
});
