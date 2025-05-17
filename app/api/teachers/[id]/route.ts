import { eq } from "drizzle-orm";
import {
  days,
  rooms,
  schedules,
  sections,
  subjects,
  teachers,
  times,
} from "~/lib/schema";
import { db } from "~/lib/tursoDb";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const teacherId = parseInt(id);
    if (isNaN(teacherId)) {
      return Response.json({ error: "Invalid teacher ID" }, { status: 400 });
    }

    const teacher = await db
      .select()
      .from(teachers)
      .where(eq(teachers.teacherId, teacherId))
      .then((rows) => rows[0]);

    if (!teacher) {
      return Response.json({ error: "Teacher not found" }, { status: 404 });
    }

    const teacherSchedules = await db
      .select({
        scheduleId: schedules.scheduleId,
        subjectId: schedules.subjectId,
        subjectName: subjects.subjectName,
        dayId: schedules.dayId,
        dayName: days.dayName,
        timeId: schedules.timeId,
        startTime: times.startTime,
        endTime: times.endTime,
        roomId: schedules.roomId,
        roomName: rooms.roomName,
        sectionId: schedules.sectionId,
        sectionName: sections.sectionName,
        year: sections.year,
      })
      .from(schedules)
      .leftJoin(subjects, eq(subjects.subjectId, schedules.subjectId))
      .leftJoin(days, eq(days.dayId, schedules.dayId))
      .leftJoin(times, eq(times.timeId, schedules.timeId))
      .leftJoin(rooms, eq(rooms.roomId, schedules.roomId))
      .leftJoin(sections, eq(sections.sectionId, schedules.sectionId))
      .where(eq(schedules.teacherId, teacherId));

    return Response.json({
      ...teacher,
      schedules: teacherSchedules,
    });
  } catch (error) {
    console.error("Error fetching teacher:", error);
    return Response.json({ error: "Failed to fetch teacher" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const teacherId = parseInt(params.id);
    if (isNaN(teacherId)) {
      return Response.json({ error: "Invalid teacher ID" }, { status: 400 });
    }

    const { teacherName, email, majorSubject, imageUrl } = await request.json();

    const updatedTeacher = await db
      .update(teachers)
      .set({
        teacherName,
        email,
        majorSubject,
        imageUrl,
      })
      .where(eq(teachers.teacherId, teacherId));

    return Response.json(updatedTeacher);
  } catch (error) {
    console.error("Error updating teacher:", error);
    return Response.json(
      { error: "Failed to update teacher" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const teacherId = parseInt(params.id);
    if (isNaN(teacherId)) {
      return Response.json({ error: "Invalid teacher ID" }, { status: 400 });
    }

    await db.delete(teachers).where(eq(teachers.teacherId, teacherId));

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting teacher:", error);
    return Response.json(
      { error: "Failed to delete teacher" },
      { status: 500 }
    );
  }
}
