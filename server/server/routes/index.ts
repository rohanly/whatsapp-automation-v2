import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

export const authRouter = new Hono();

authRouter.get(
  "/hello",
  zValidator(
    "query",
    z.object({
      name: z.string().optional(),
    })
  ),
  async (ctx) => {
    const query = ctx.req.valid("query");
    return ctx.json({
      message: `Hello ${query.name || "World"}`,
    });
  }
);
