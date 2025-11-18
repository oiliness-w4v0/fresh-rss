import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./db/schema/index.ts",
  out: "./db/migrations",
  dialect: "sqlite",
  verbose: true,
  strict: true,
  dbCredentials: {
    url: "file:fresh-rss.db",
  },
});
