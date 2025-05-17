import { and, eq } from "drizzle-orm";
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

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const roomId = url.searchParams.get("roomId");
    const day = url.searchParams.get("day");
    const sectionId = url.searchParams.get("sectionId");

    const conditions = [];
    if (roomId) {
      conditions.push(eq(schedules.roomId, parseInt(roomId)));
    }
    if (day) {
      conditions.push(eq(days.dayName, day));
    }
    if (sectionId) {
      conditions.push(eq(schedules.sectionId, parseInt(sectionId)));
    }

    const teacherSchedules = await db
      .select({
        scheduleId: schedules.scheduleId,
        teacherId: schedules.teacherId,
        teacherName: teachers.teacherName,
        subjectId: schedules.subjectId,
        subjectName: subjects.subjectName,
        roomId: schedules.roomId,
        roomName: rooms.roomName,
        dayId: schedules.dayId,
        dayName: days.dayName,
        timeId: schedules.timeId,
        startTime: times.startTime,
        endTime: times.endTime,
        sectionId: schedules.sectionId,
        sectionName: sections.sectionName,
        year: sections.year,
      })
      .from(schedules)
      .innerJoin(teachers, eq(schedules.teacherId, teachers.teacherId))
      .innerJoin(subjects, eq(schedules.subjectId, subjects.subjectId))
      .innerJoin(rooms, eq(schedules.roomId, rooms.roomId))
      .innerJoin(days, eq(schedules.dayId, days.dayId))
      .innerJoin(times, eq(schedules.timeId, times.timeId))
      .innerJoin(sections, eq(schedules.sectionId, sections.sectionId))
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    return Response.json(teacherSchedules);
  } catch (error) {
    console.error("Error fetching teacher schedules:", error);
    return Response.json(
      { error: "Failed to fetch teacher schedules" },
      { status: 500 }
    );
  }
}
