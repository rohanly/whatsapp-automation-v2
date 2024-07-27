import { Lucia } from "lucia";
import { BetterSqlite3Adapter } from "@lucia-auth/adapter-sqlite";
import { sqlite } from "~/db";
import { SelectUser } from "~/models/users";

const adapter = new BetterSqlite3Adapter(sqlite, {
  user: "users",
  session: "sessions",
});

export const lucia = new Lucia(adapter, {
  getUserAttributes: (attributes) => ({
    name: attributes.name,
    email: attributes.email,
  }),
});
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: SelectUser;
  }
}
