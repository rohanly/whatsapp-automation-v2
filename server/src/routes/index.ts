import { Hono } from "hono";
import { userRouter } from "./users";
import { relationRouter } from "./relation-types";
import { peopleRouter } from "./people.route";
import { peopleRelationsRouter } from "./people-relations.route";
import { eventsRouter } from "./events";
import { eventTypesRouter } from "./events-types";

export const router = new Hono();

router.route("/users", userRouter);
router.route("/relation_types", relationRouter);
router.route("/people", peopleRouter);
router.route("/people_relations", peopleRelationsRouter);
router.route("/events", eventsRouter);
router.route("/event_types", eventTypesRouter.getRouter());
