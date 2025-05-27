// /api/teachers/route.ts - Update this file
import { eq, like, or, sql } from "drizzle-orm"; // Import or and sql
import { NextResponse } from "next/server";
import { schedules, subjects, teachers } from "~/lib/schema";
import { db } from "~/lib/tursoDb";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const pageSize = parseInt(url.searchParams.get("limit") || "9");
    const searchTerm = url.searchParams.get("searchTerm") || ""; // Get searchTerm
    const offset = (page - 1) * pageSize;

    // Build the WHERE clause for filtering
    const whereClause = searchTerm
      ? or(
          like(teachers.teacherName, `%${searchTerm}%`),
          like(teachers.email, `%${searchTerm}%`),
          like(teachers.employeeId, `%${searchTerm}%`) // Include employeeId in search
        )
      : undefined; // No WHERE clause if no search term

    // Fetch total count of filtered teachers
    const totalCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(teachers)
      .where(whereClause); // Apply filter to count

    const totalFilteredTeachers = totalCountResult[0].count;

    // Fetch filtered and paginated teachers
    const paginatedTeachers = await db
      .select()
      .from(teachers)
      .where(whereClause) // Apply filter to main query
      .limit(pageSize)
      .offset(offset);

    // Fetch all teacher schedules (this part might need optimization for very large data)
    // Consider fetching schedules only for the paginated teachers if performance is an issue
    const allTeacherSchedules = await db
      .select({
        teacherId: schedules.teacherId,
        subjectId: schedules.subjectId,
        subjectName: subjects.subjectName,
      })
      .from(schedules)
      .leftJoin(subjects, eq(schedules.subjectId, subjects.subjectId));

    const teacherSchedulesData = allTeacherSchedules.reduce((acc, curr) => {
      if (!acc[curr.teacherId]) {
        acc[curr.teacherId] = [];
      }
      if (curr.subjectName) {
        acc[curr.teacherId].push({
          subjectId: curr.subjectId,
          subjectName: curr.subjectName,
        });
      }
      return acc;
    }, {} as Record<number, { subjectId: number; subjectName: string }[]>);

    const teachersWithSubjects = paginatedTeachers.map((teacher) => ({
      ...teacher,
      subjects: teacherSchedulesData[teacher.teacherId] || [],
    }));

    return NextResponse.json({
      data: teachersWithSubjects,
      total: totalFilteredTeachers, // Return the total count of filtered teachers
      page,
      pageSize,
    });
  } catch (error) {
    console.error("Error fetching teachers:", error);
    return NextResponse.json(
      { error: "Failed to fetch teachers" },
      { status: 500 }
    );
  }
}

// POST function remains the same as before
export async function POST(request: Request) {
  try {
    const { teacherName, email, majorSubject, imageUrl, employeeId } =
      await request.json();

    const newTeacher = await db.insert(teachers).values({
      teacherName,
      email,
      majorSubject,
      imageUrl,
      employeeId,
    });

    return NextResponse.json(newTeacher);
  } catch (error: any) {
    console.error("Error creating teacher:", error);
    if (error.message && error.message.includes("UNIQUE constraint failed")) {
      return NextResponse.json(
        { error: "Employee ID must be unique." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create teacher" },
      { status: 500 }
    );
  }
}
