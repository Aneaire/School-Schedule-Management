import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "~/lib/db";
import { subjects } from "~/lib/schema";

export async function GET() {
  try {
    const allSubjects = await db.select().from(subjects);
    return NextResponse.json(allSubjects);
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return NextResponse.json(
      { error: "Failed to fetch subjects" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { subjectCode, subjectName, units } = body;

    if (!subjectCode || !subjectName || !units) {
      return NextResponse.json(
        { error: "Subject code, name, and units are required" },
        { status: 400 }
      );
    }

    // Check if subject code already exists
    const existing = await db
      .select()
      .from(subjects)
      .where(eq(subjects.subjectCode, subjectCode));

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Subject code already exists" },
        { status: 409 }
      );
    }

    // Insert new subject
    const newSubject = await db.insert(subjects).values({
      subjectCode,
      subjectName,
      units,
    });

    return NextResponse.json(newSubject);
  } catch (error) {
    console.error("Error creating subject:", error);
    return NextResponse.json(
      { error: "Failed to create subject" },
      { status: 500 }
    );
  }
}
