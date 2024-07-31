import "dotenv/config";
import webPush from "web-push";
import { createPrivateRouter } from "~/builder";
import { db } from "~/db";
import { pushNotificationsTable } from "~/models";

if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
  throw new Error("Push Notification Error: No VAPID KEY in .env file");
}

webPush.setVapidDetails(
  `mailto:${process.env.EMAIL_ID}`,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const router = createPrivateRouter();

router.post("/subscribe", async (c) => {
  const user = c.get("user");

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { subscription } = c.req.json();

  const resp = await db
    .insert(pushNotificationsTable)
    .values({
      userId: user?.id,
      subscription: subscription,
    })
    .returning();

  return c.json(resp);
});

// To send notifications, you could query the database for subscriptions and send to each
router.post("/send", async (c) => {
  const payload = {
    title: "New Notification",
    body: "This is a push notification!",
  };

  const subscriptions = await db.query.pushNotificationsTable.findMany();
  for (const sub of subscriptions) {
    try {
      await webPush.sendNotification(
        sub.subscription as any,
        JSON.stringify(payload)
      );
    } catch (error) {
      console.error("Error sending notification", error);
    }
  }

  return c.json({ success: true });
});

export const pushNotificationsRouter = router;
