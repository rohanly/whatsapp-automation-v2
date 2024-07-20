import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { poweredBy } from "hono/powered-by";
import { jwt } from "hono/jwt";
import { swaggerUI } from "@hono/swagger-ui";

import { userRouter } from "./routes/users";
import { relationRouter } from "./routes/relations";
import { peopleRouter } from "./routes/people";
import { peopleRelationRouter } from "./routes/people-to-relations";
import { eventTypesRouter } from "./routes/events-types";
import { eventsRouter } from "./routes/events";
import { authRouter } from "./routes";

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

app.get("/hello", (c) => {
  return c.json({
    message: "Hello from Hono!",
  });
});

const apiRouter = app.basePath("/api");

apiRouter.route("/auth", authRouter);
apiRouter.route("/users", userRouter);
apiRouter.route("/relations", relationRouter);
apiRouter.route("/people", peopleRouter);
apiRouter.route("/people_relations", peopleRelationRouter);
apiRouter.route("/events", eventsRouter.getRouter());
apiRouter.route("/event_types", eventTypesRouter.getRouter());

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
