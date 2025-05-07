import type { Config } from "drizzle-kit";

export default {
  schema: "./lib/schema.ts",
  out: "./drizzle",
  dialect: "sqlite", // ✅ Required for newer drizzle-kit
  dbCredentials: {
    url: "./sqlite.db", // ✅ 'url' is correct here
  },
} satisfies Config;
