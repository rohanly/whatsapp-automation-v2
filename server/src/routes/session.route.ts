import { Hono } from "hono";

export const sessionRouter = new Hono();

sessionRouter.get("/me", async (c) => {});

sessionRouter.post("/login", async (c) => {});

sessionRouter.post("/logout", async (c) => {});
