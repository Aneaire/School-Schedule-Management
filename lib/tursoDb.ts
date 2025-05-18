import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { schema } from "./schema";

const client = createClient({
  url: "libsql://school-aneaire.aws-ap-northeast-1.turso.io",
  authToken:
    "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJnaWQiOiI1NTM0ZmM5Ni02NjFiLTRlZWEtYWJiOC02YTI3OTU4NDliOGMiLCJpYXQiOjE3NDc1NTYzNDcsInJpZCI6IjI1NTRiYWVmLWJmMTYtNGU3NC05OGViLTA5MzIxNmJhMTcyMSJ9.sdxmHwPMVmjgUE8cPz5cjCE8UYak27bYkSdmi4wffxoeCRE4L34fBau0uyYri-hkqxyU-5aExHFlisYCAdHnBA",
});

export const db = drizzle(client, { schema });
