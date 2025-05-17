import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { schema } from "./schema";

const client = createClient({
  url: "libsql://school-scheduler-aneaire.aws-ap-northeast-1.turso.io",
  authToken:
    "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NDc0NTY2NjAsImlkIjoiMTJmMzBkYTktZjFlNS00MDAzLWJjNzctMzgwM2E0NGYyYzAwIiwicmlkIjoiNTQ5MzhlZTQtZmJkNC00N2M3LWJmYjUtOTE4ZGM3ZjI1Y2FmIn0.pUPDxIzrpTC-IfYk7cxSp4tMfvumHq_bNHS-MqTdnsLAbt_8t2F9PN_al82J8MmiE_S36g7bSt7vZ_Q6pq_wBQ",
});

export const db = drizzle(client, { schema });
