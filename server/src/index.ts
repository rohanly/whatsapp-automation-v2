import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { poweredBy } from "hono/powered-by";
import { jwt } from "hono/jwt";
import { swaggerUI } from "@hono/swagger-ui";
import { router } from "./routes";
import { serveStatic } from "@hono/node-server/serve-static";
import { Variables } from "./bindings";

const app = new Hono<{
  Variables: Variables;
}>();

//middlewares
app.use(poweredBy());
app.use(logger());
app.get("/_swagger", swaggerUI({ url: "/docs" }));

app.use(
  "/*",
  serveStatic({
    root: "./public",
  })
);

app.route("/api", router);

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
