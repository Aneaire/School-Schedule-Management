import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { schema } from "./schema";

const client = createClient({
  url: "libsql://scheduler-aneaire.aws-ap-northeast-1.turso.io",
  authToken:
    "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NDc0NTE5MzQsImlkIjoiYjk3OTUyZjgtMzA4Ni00ZWE4LTliYWMtNmNiODBhOTU3NjgyIiwicmlkIjoiMTY4NDI5NjktMjE1Ny00MWM4LThlNTMtNDU3NjkyOTY3OTIzIn0.W5KSFHyox-m0SNsaN5mMpPYbXThGlVjxhYLAs_u8RkWGaP6ElrJqWl_eDIiP1ufp5rZDvGAiBHuIjk_TofZGDA",
});

export const db = drizzle(client, { schema });
