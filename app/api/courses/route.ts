import { NextResponse } from "next/server";
import { courses } from "~/lib/schema";
import { db } from "~/lib/tursoDb";

export async function GET() {
  try {
    const allCourses = await db.select().from(courses);
    return NextResponse.json(allCourses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { courseCode, courseName } = await request.json();

    const newCourse = await db.insert(courses).values({
      courseCode: courseCode.toUpperCase(),
      courseName,
    });

    return NextResponse.json(newCourse);
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    );
  }
}
