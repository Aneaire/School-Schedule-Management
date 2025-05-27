import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import {
  classes,
  days,
  rooms,
  schedules,
  sections,
  subjects,
  teachers,
  times,
} from "~/lib/schema";
import { db } from "~/lib/tursoDb";
import { formatHour } from "~/utils/time";

// Helper to parse "HH:MM" → decimal hours
function parseHour(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h + m / 60;
}

// Check if two time blocks overlap
function isOverlapping(
  start1: number,
  end1: number,
  start2: number,
  end2: number
) {
  return start1 < end2 && start2 < end1;
}

export async function POST(
  req: Request,
  { params }: { params: { teacherId: string } }
) {
  try {
    const body = await req.json();
    const {
      subjectId,
      roomId,
      day,
      startHour,
      duration,
      sectionId,
      teacherId,
    }: {
      subjectId: number;
      roomId: number;
      day: string;
      startHour: number;
      duration: number;
      sectionId: number;
      teacherId: number;
    } = body;

    const endHour = startHour + duration / 60;

    const dayRecord = await db
      .select({ dayId: days.dayId })
      .from(days)
      .where(eq(days.dayName, day));
    const dayId = dayRecord[0]?.dayId;
    if (!dayId) {
      return NextResponse.json(
        { error: "Invalid day provided" },
        { status: 400 }
      );
    }

    const sectionRecord = await db
      .select({
        sectionName: sections.sectionName,
        year: sections.year,
        courseId: sections.courseId,
      })
      .from(sections)
      .where(eq(sections.sectionId, sectionId));
    const section = sectionRecord[0];
    if (!section) {
      return NextResponse.json(
        { error: "Invalid section ID" },
        { status: 400 }
      );
    }

    const classResult = await db
      .select({ classId: classes.classId })
      .from(classes)
      .where(
        and(
          eq(classes.section, section.sectionName),
          eq(classes.year, section.year),
          eq(classes.roomId, roomId),
          eq(classes.courseId, section.courseId)
        )
      );
    let classId = classResult[0]?.classId;
    if (!classId) {
      const [newClass] = await db
        .insert(classes)
        .values({
          section: section.sectionName,
          year: section.year,
          roomId,
          courseId: section.courseId,
        })
        .returning({ classId: classes.classId });
      classId = newClass.classId;
    }

    const conflictChecks = await Promise.all([
      db
        .select({
          startTime: times.startTime,
          endTime: times.endTime,
          subjectName: subjects.subjectName,
          teacherName: teachers.teacherName,
        })
        .from(schedules)
        .innerJoin(times, eq(schedules.timeId, times.timeId))
        .innerJoin(subjects, eq(schedules.subjectId, subjects.subjectId))
        .innerJoin(teachers, eq(schedules.teacherId, teachers.teacherId))
        .where(and(eq(schedules.roomId, roomId), eq(schedules.dayId, dayId))),

      db
        .select({
          startTime: times.startTime,
          endTime: times.endTime,
          subjectName: subjects.subjectName,
          teacherName: teachers.teacherName,
        })
        .from(schedules)
        .innerJoin(times, eq(schedules.timeId, times.timeId))
        .innerJoin(subjects, eq(schedules.subjectId, subjects.subjectId))
        .innerJoin(teachers, eq(schedules.teacherId, teachers.teacherId))
        .where(
          and(eq(schedules.sectionId, sectionId), eq(schedules.dayId, dayId))
        ),

      db
        .select({
          startTime: times.startTime,
          endTime: times.endTime,
          subjectName: subjects.subjectName,
          roomName: rooms.roomName,
        })
        .from(schedules)
        .innerJoin(times, eq(schedules.timeId, times.timeId))
        .innerJoin(subjects, eq(schedules.subjectId, subjects.subjectId))
        .innerJoin(rooms, eq(schedules.roomId, rooms.roomId))
        .where(
          and(eq(schedules.teacherId, teacherId), eq(schedules.dayId, dayId))
        ),
    ]);

    const [roomSchedules, sectionSchedules, teacherSchedules] = conflictChecks;

    const roomSchedulesResponse = roomSchedules.map((c: any) => ({
      teacherName: c.teacherName,
      subjectName: c.subjectName,
      roomName: c.roomName,
      conflictStartHour: c.startTime,
      conflictEndHour: c.endTime,
    }));

    const roomConflicts = roomSchedules
      .filter((c) =>
        isOverlapping(
          startHour,
          endHour,
          parseHour(c.startTime),
          parseHour(c.endTime)
        )
      )
      .map((c) => ({
        teacherName: c.teacherName,
        subjectName: c.subjectName,
        roomName: "",
        conflictStartHour: c.startTime,
        conflictEndHour: c.endTime,
      }));
    const sectionSchedulesResponse = sectionSchedules.map((c: any) => ({
      teacherName: c.teacherName,
      subjectName: c.subjectName,
      roomName: "",
      conflictStartHour: c.startTime,
      conflictEndHour: c.endTime,
    }));
    const sectionConflicts = sectionSchedules
      .filter((c) =>
        isOverlapping(
          startHour,
          endHour,
          parseHour(c.startTime),
          parseHour(c.endTime)
        )
      )
      .map((c) => ({
        teacherName: c.teacherName,
        subjectName: c.subjectName,
        roomName: "",
        conflictStartHour: c.startTime,
        conflictEndHour: c.endTime,
      }));
    const teacherSchedulesResponse = teacherSchedules.map((c: any) => ({
      subjectName: c.subjectName,
      roomName: c.roomName,
      conflictStartHour: c.startTime,
      conflictEndHour: c.endTime,
    }));
    const teacherConflicts = teacherSchedules
      .filter((c) =>
        isOverlapping(
          startHour,
          endHour,
          parseHour(c.startTime),
          parseHour(c.endTime)
        )
      )
      .map((c) => ({
        teacherName: "",
        subjectName: c.subjectName,
        roomName: c.roomName,
        conflictStartHour: c.startTime,
        conflictEndHour: c.endTime,
      }));

    if (
      roomConflicts.length > 0 ||
      sectionConflicts.length > 0 ||
      teacherConflicts.length > 0
    ) {
      return NextResponse.json(
        {
          error: "Schedule conflict detected",
          conflicts: {
            room: roomSchedulesResponse,
            section: sectionSchedulesResponse,
            teacher: teacherSchedulesResponse,
            allTeacherSchedules: teacherSchedules.map((c: any) => ({
              subjectName: c.subjectName,
              roomName: c.roomName,
              conflictStartHour: c.startTime,
              conflictEndHour: c.endTime,
            })),
          },
        },
        { status: 409 }
      );
    }

    const [newSchedule] = await db
      .insert(schedules)
      .values({
        teacherId,
        subjectId,
        roomId,
        sectionId,
        classId,
        timeId: await getOrCreateTimeId(startHour, duration),
        dayId,
      })
      .returning();

    return NextResponse.json(newSchedule, { status: 201 });
  } catch (error) {
    console.error("Error assigning subject:", error);
    return NextResponse.json(
      { error: "Failed to assign subject" },
      { status: 500 }
    );
  }
}

async function getOrCreateTimeId(startHour: number, duration: number) {
  const startTime = formatHour(startHour); // e.g., "07:30"
  const endHour = startHour + duration / 60;
  const endTime = formatHour(endHour); // e.g., "09:00"

  const existing = await db
    .select({ timeId: times.timeId })
    .from(times)
    .where(and(eq(times.startTime, startTime), eq(times.endTime, endTime)));

  if (existing.length > 0) return existing[0].timeId;

  const [newTime] = await db
    .insert(times)
    .values({ startTime, endTime })
    .returning({ timeId: times.timeId });

  return newTime.timeId;
}
