import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { schema } from "./schema";

const sqlite = new Database("sqlite.db");
const db = drizzle(sqlite, { schema });

export { db };
