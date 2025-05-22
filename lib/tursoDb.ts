import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { schema } from "./schema";

const url =
  process.env.TURSO_DATABASE_URL ??
  process.env.NEXT_PUBLIC_TURSO_DATABASE_URL ??
  "libsql://school-1-aneaire.aws-ap-northeast-1.turso.io";
const authToken =
  process.env.TURSO_AUTH_TOKEN ??
  process.env.NEXT_PUBLIC_TURSO_AUTH_TOKEN ??
  "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJnaWQiOiI1NTM0ZmM5Ni02NjFiLTRlZWEtYWJiOC02YTI3OTU4NDliOGMiLCJpYXQiOjE3NDc5MjE1OTksInJpZCI6IjI1NTRiYWVmLWJmMTYtNGU3NC05OGViLTA5MzIxNmJhMTcyMSJ9.nVKmYFjw5WHAWzhzXg5RoVdP8WhfheEprPpLES9QaUH2FoVsXgm5vNeIxG7qghOXZ_OcsArRLQ-4ujazShaWCw";

if (!url) {
  throw new Error("TURSO_DATABASE_URL is not defined");
}

const client = createClient({
  url,
  authToken,
});

export const db = drizzle(client, { schema });
