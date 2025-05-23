// /api/teachers with pagination support
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { schedules, subjects, teachers } from "~/lib/schema";
import { db } from "~/lib/tursoDb";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const pageSize = parseInt(url.searchParams.get("limit") || "9");
    const offset = (page - 1) * pageSize;

    const [totalTeachers, allTeachers] = await Promise.all([
      db.select().from(teachers),
      db.select().from(teachers).limit(pageSize).offset(offset),
    ]);

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

    const teachersWithSubjects = allTeachers.map((teacher) => ({
      ...teacher,
      subjects: teacherSchedulesData[teacher.teacherId] || [],
    }));

    return NextResponse.json({
      data: teachersWithSubjects,
      total: totalTeachers.length,
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

export async function POST(request: Request) {
  try {
    const { teacherName, email, majorSubject, imageUrl } = await request.json();

    const newTeacher = await db.insert(teachers).values({
      teacherName,
      email,
      majorSubject,
      imageUrl,
    });

    return NextResponse.json(newTeacher);
  } catch (error) {
    console.error("Error creating teacher:", error);
    return NextResponse.json(
      { error: "Failed to create teacher" },
      { status: 500 }
    );
  }
}
