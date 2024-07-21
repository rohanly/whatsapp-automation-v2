import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { poweredBy } from "hono/powered-by";
import { jwt } from "hono/jwt";
import { swaggerUI } from "@hono/swagger-ui";
import { router } from "./routes";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

//middlewares
app.use(poweredBy());
app.use(logger());
app.get("/_swagger", swaggerUI({ url: "/docs" }));

app.use(
  "/auth/*",
  jwt({
    secret: "it-is-very-secret",
  })
);

// storage
app.use("/uploads/*", async (c, next) => {
  await next();
  c.header("Content-Type", "image/jpeg");
});

app.route("/api", router);

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
