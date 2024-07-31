import { Hono } from "hono";
import { Variables } from "./bindings";
import { authMiddleware } from "./middlewares/auth.middleware";

export const createPublicRouter = () => {
  const router = new Hono<{ Variables: Variables }>();
  return router;
};

export const createPrivateRouter = () => {
  const router = new Hono<{ Variables: Variables }>();
  router.use(authMiddleware);
  return router;
};
