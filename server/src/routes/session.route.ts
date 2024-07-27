import { Hono } from "hono";
import { Variables } from "~/bindings";

export const sessionRouter = new Hono<{ Variables: Variables }>();

sessionRouter.get("/me", async (c) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: "Please login" }, 404);
  }

  return c.json(user);
});
