// app/api/sections/route.ts

import { sections } from "~/lib/schema";
import { db } from "~/lib/tursoDb";

export async function GET() {
  try {
    const allSections = await db
      .select({
        sectionId: sections.sectionId,
        sectionName: sections.sectionName,
        year: sections.year,
        courseId: sections.courseId,
      })
      .from(sections);

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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sectionName, year, courseId } = body;

    if (!sectionName || !year || !courseId) {
      return new Response(
        JSON.stringify({
          error: "Section name, year, and course are required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const [newSection] = await db
      .insert(sections)
      .values({
        sectionName,
        year,
        courseId,
      })
      .returning();

    return new Response(JSON.stringify(newSection), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating section:", error);
    return new Response(JSON.stringify({ error: "Failed to create section" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
