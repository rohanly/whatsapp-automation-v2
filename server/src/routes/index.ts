import { Hono } from "hono";
import { userRouter } from "./users";
import { relationRouter } from "./relation-types";
import { peopleRouter } from "./people.route";
import { peopleRelationsRouter } from "./people-relations.route";
import { eventsRouter } from "./events";
import { eventTypesRouter } from "./events-types";
import { sessionRouter } from "./session.route";
import { templateRouter } from "./template.route";
import { messageRelations } from "~/models/messages";
import { messageRouter } from "./messages.route";
import { authRouter } from "./auth.route";

export const router = new Hono();

router.route("/auth", authRouter);
router.route("/sessions", sessionRouter);
router.route("/users", userRouter);
router.route("/relation_types", relationRouter);
router.route("/people", peopleRouter);
router.route("/people_relations", peopleRelationsRouter);
router.route("/events", eventsRouter);
router.route("/templates", templateRouter);
router.route("/messages", messageRouter);
router.route("/event_types", eventTypesRouter.getRouter());
