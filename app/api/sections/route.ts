import { db } from "~/lib/db";
import { sections } from "~/lib/schema";

export async function GET() {
  try {
    const allSections = await db.select().from(sections);
    return new Response(JSON.stringify(allSections), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching sections:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch sections" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
