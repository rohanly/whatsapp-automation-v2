import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env" });

export default defineConfig({
  schema: "./src/models/*.ts",
  out: "./src/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: "./database.db",
  },
});
