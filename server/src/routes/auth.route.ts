import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { Scrypt } from "lucia";
import { z } from "zod";
import { Variables } from "~/bindings";
import { db } from "~/db";
import { lucia } from "~/db/lucia";
import { usersTable } from "~/models/users";

export const authRouter = new Hono<{ Variables: Variables }>();

authRouter.post(
  "/signup",
  zValidator(
    "json",
    z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string(),
    })
  ),
  async (c) => {
    try {
      const { name, email, password } = c.req.valid("json");

      const existingUser = await db.query.usersTable.findFirst({
        where: eq(usersTable.email, email),
      });

      if (existingUser) {
        return c.json({ error: "User with the email already exists." }, 400);
      }

      const hashedPassword = await new Scrypt().hash(password);

      const user = await db
        .insert(usersTable)
        .values({
          name: name,
          email: email,
          password: hashedPassword,
        })
        .returning();

      return c.json(user);
    } catch (error) {
      return c.json({ error: error }, 500);
    }
  }
);
authRouter.post(
  "/login",
  zValidator(
    "json",
    z.object({
      email: z.string().email(),
      password: z.string(),
    })
  ),
  async (c) => {
    try {
      const { email, password } = c.req.valid("json");

      const user = await db.query.usersTable.findFirst({
        where: eq(usersTable.email, email),
      });

      if (!user) {
        return c.json({ error: "Invalid error or password." }, 400);
      }

      const isValidPassword = await new Scrypt().verify(
        user.password,
        password
      );

      if (!isValidPassword) {
        return c.json({ error: "Invalid error or password." }, 400);
      }

      const session = await lucia.createSession(user.id, {});
      const cookie = lucia.createSessionCookie(session.id);

      c.header("Set-Cookie", cookie.serialize(), { append: true });

      return c.json(user);
    } catch (error) {
      return c.json({ error: error }, 500);
    }
  }
);
authRouter.post("/logout", async (c) => {
  const session = c.get("session");
  if (session) {
    await lucia.invalidateSession(session.id);
  }

  const cookie = lucia.createBlankSessionCookie();

  c.header("Set-Cookie", cookie.serialize(), { append: true });

  return c.json({ message: "Logout successful!" });
});
