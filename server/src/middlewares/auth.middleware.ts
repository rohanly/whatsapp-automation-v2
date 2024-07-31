import { Context, Next } from "hono";
import { getCookie } from "hono/cookie";
import { lucia } from "~/db/lucia";

export async function authMiddleware(c: Context, next: Next) {
  const sessionId = getCookie(c, lucia.sessionCookieName);

  if (!sessionId) {
    c.set("user", null);
    c.set("session", null);
    return c.json({ error: "Unauthorized" }, 403);
  }

  const { session, user } = await lucia.validateSession(sessionId);

  if (session && session.fresh) {
    c.header("Set-Cookie", lucia.createSessionCookie(session.id).serialize(), {
      append: true,
    });
  }

  if (!session) {
    c.header("Set-Cookie", lucia.createBlankSessionCookie().serialize(), {
      append: true,
    });
    return c.json({ error: "Unauthorized" }, 403);
  }

  c.set("user", user);
  c.set("session", session);
  return next();
}
