import { Hono } from "hono";
import { createPrivateRouter } from "~/builder";

export const sessionRouter = createPrivateRouter();

sessionRouter.get("/me", async (c) => {
  const user = c.get("user");

  if (!user) {
    return c.json({ error: "Please login" }, 404);
  }

  return c.json(user);
});
