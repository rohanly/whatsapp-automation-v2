import { Hono } from "hono";
import { logger } from "hono/logger";
import { poweredBy } from "hono/powered-by";
import { jwt } from "hono/jwt";
import { swaggerUI } from "@hono/swagger-ui";

import type { JwtVariables } from "hono/jwt";
import { authRouter } from "@/server/routes";
import { userRouter } from "./routes/users";
import { relationRouter } from "./routes/relations";
import { peopleRouter } from "./routes/people";
import { peopleRelationRouter } from "./routes/people-to-relations";
import { eventTypesRouter } from "./routes/events-types";
import { eventsRouter } from "./routes/events";

type Variables = JwtVariables;

const app = new Hono<{ Variables: Variables }>().basePath("/api");

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

app.route("/auth", authRouter);
app.route("/users", userRouter);
app.route("/relations", relationRouter);
app.route("/people", peopleRouter);
app.route("/people_relations", peopleRelationRouter);
app.route("/events", eventsRouter.getRouter());
app.route("/event_types", eventTypesRouter.getRouter());

export default app;
export type AppType = typeof app;
