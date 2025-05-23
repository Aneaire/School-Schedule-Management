import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
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

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const sectionId = url.searchParams.get("sectionId");
    const roomId = url.searchParams.get("roomId");

    if (!sectionId && !roomId) {
      return NextResponse.json(
        { error: "Missing sectionId or roomId" },
        { status: 400 }
      );
    }

    const whereCondition = sectionId
      ? eq(schedules.sectionId, parseInt(sectionId))
      : eq(schedules.roomId, parseInt(roomId!));

    const scheduleData = await db
      .select({
        subjectName: subjects.subjectName,
        startTime: times.startTime,
        endTime: times.endTime,
        dayName: days.dayName,
        teacherName: teachers.teacherName,
        roomCode: rooms.roomCode,
        ...(roomId ? { sectionName: sections.sectionName } : {}),
        ...(sectionId ? { roomName: rooms.roomName } : {}),
      })
      .from(schedules)
      .innerJoin(subjects, eq(schedules.subjectId, subjects.subjectId))
      .innerJoin(times, eq(schedules.timeId, times.timeId))
      .innerJoin(teachers, eq(schedules.teacherId, teachers.teacherId))
      .innerJoin(days, eq(schedules.dayId, days.dayId))
      .innerJoin(sections, eq(schedules.sectionId, sections.sectionId))
      .innerJoin(rooms, eq(schedules.roomId, rooms.roomId))
      .where(whereCondition);

    return NextResponse.json(scheduleData);
  } catch (error) {
    console.error("Error fetching schedule:", error);
    return NextResponse.json(
      { error: "Failed to fetch schedule" },
      { status: 500 }
    );
  }
}
