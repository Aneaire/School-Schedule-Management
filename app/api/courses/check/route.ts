import { eq } from "drizzle-orm";
import { courses } from "~/lib/schema";
import { db } from "~/lib/tursoDb";

export async function POST(request: Request) {
  try {
    const { courseCode } = await request.json();

    const existingCourse = await db
      .select()
      .from(courses)
      .where(eq(courses.courseCode, courseCode.toUpperCase()))
      .then((rows) => rows[0]);

    return Response.json({ exists: !!existingCourse });
  } catch (error) {
    console.error("Error checking course:", error);
    return Response.json({ error: "Failed to check course" }, { status: 500 });
  }
}
