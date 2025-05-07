import { and, eq } from "drizzle-orm";
import { db } from "~/lib/db";
import { sections } from "~/lib/schema";

export async function POST(request: Request) {
  try {
    const { sectionName, year, courseId } = await request.json();

    const existingSection = await db
      .select()
      .from(sections)
      .where(
        and(
          eq(sections.sectionName, sectionName),
          eq(sections.year, year),
          eq(sections.courseId, courseId)
        )
      )
      .then((rows) => rows[0]);

    return Response.json({ exists: !!existingSection });
  } catch (error) {
    console.error("Error checking section:", error);
    return Response.json({ error: "Failed to check section" }, { status: 500 });
  }
}
