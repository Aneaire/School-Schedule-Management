// app/api/teachers/[id]/assign-subject/route.ts
import { and, eq } from "drizzle-orm";
import { db } from "~/lib/db";
import {
  classes,
  courses,
  days,
  rooms,
  schedules,
  sections,
  subjects,
  teachers,
  times,
} from "~/lib/schema";

// Function to ensure a course and class exist
async function ensureCourseAndClassExist() {
  // First, check if we have any courses
  const existingCourses = await db.select().from(courses);
  let courseId: number;

  if (existingCourses.length === 0) {
    // Create a default course if none exist
    const [newCourse] = await db
      .insert(courses)
      .values({
        courseCode: "CS101",
        courseName: "Computer Science",
      })
      .returning();
    courseId = newCourse.courseId;
  } else {
    courseId = existingCourses[0].courseId;
  }

  // Then, check if we have any classes
  const existingClasses = await db.select().from(classes);
  if (existingClasses.length === 0) {
    // Get the first room
    const [room] = await db.select().from(rooms).limit(1);
    if (!room) {
      throw new Error("No rooms available");
    }

    // Create a default class
    await db.insert(classes).values({
      section: "A",
      year: 2024,
      courseId,
      roomId: room.roomId,
    });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Ensure we have a course and class
    await ensureCourseAndClassExist();

    const { id } = await params;
    const teacherId = parseInt(id);
    console.log("Teacher ID:", teacherId);
    if (!teacherId || isNaN(teacherId)) {
      return Response.json({ error: "Invalid teacher ID" }, { status: 400 });
    }

    const body = await request.json();
    const { subjectId, roomId, day, startHour, duration, sectionId } = body;
    console.log(subjectId, roomId, day, startHour, duration, sectionId);

    // Validate required fields
    if (
      !subjectId ||
      !roomId ||
      !day ||
      !startHour ||
      !duration ||
      !sectionId
    ) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get day ID
    const dayRecord = await db
      .select()
      .from(days)
      .where(eq(days.dayName, day))
      .then((rows) => rows[0]);

    if (!dayRecord) {
      return Response.json({ error: "Invalid day" }, { status: 400 });
    }

    // Get time ID based on start hour
    const formattedStartTime = `${startHour.toString().padStart(2, "0")}:00`;
    const timeRecord = await db
      .select()
      .from(times)
      .where(eq(times.startTime, formattedStartTime))
      .then((rows) => rows[0]);

    if (!timeRecord) {
      return Response.json({ error: "Invalid start time" }, { status: 400 });
    }

    // Get teacher
    const teacher = await db
      .select()
      .from(teachers)
      .where(eq(teachers.teacherId, teacherId))
      .then((rows) => rows[0]);

    if (!teacher) {
      return Response.json({ error: "Teacher not found" }, { status: 404 });
    }

    // Get subject
    const subject = await db
      .select()
      .from(subjects)
      .where(eq(subjects.subjectId, subjectId))
      .then((rows) => rows[0]);

    if (!subject) {
      return Response.json({ error: "Subject not found" }, { status: 404 });
    }

    // Get room
    const room = await db
      .select()
      .from(rooms)
      .where(eq(rooms.roomId, roomId))
      .then((rows) => rows[0]);

    if (!room) {
      return Response.json({ error: "Room not found" }, { status: 404 });
    }

    // Get section
    const section = await db
      .select()
      .from(sections)
      .where(eq(sections.sectionId, sectionId))
      .then((rows) => rows[0]);

    if (!section) {
      return Response.json({ error: "Section not found" }, { status: 404 });
    }

    // Get default class (for now, use the first one)
    const defaultClass = await db
      .select()
      .from(classes)
      .then((rows) => rows[0]);

    if (!defaultClass) {
      return Response.json({ error: "No classes available" }, { status: 404 });
    }

    // Check for room conflicts
    const roomConflicts = await db
      .select({
        teacherName: teachers.teacherName,
        subjectName: subjects.subjectName,
        roomName: rooms.roomName,
        conflictStartHour: times.startTime,
        conflictDuration: times.endTime,
      })
      .from(schedules)
      .innerJoin(teachers, eq(schedules.teacherId, teachers.teacherId))
      .innerJoin(subjects, eq(schedules.subjectId, subjects.subjectId))
      .innerJoin(rooms, eq(schedules.roomId, rooms.roomId))
      .innerJoin(times, eq(schedules.timeId, times.timeId))
      .where(
        and(eq(schedules.roomId, roomId), eq(schedules.dayId, dayRecord.dayId))
      );

    // Check for section conflicts
    const sectionConflicts = await db
      .select({
        teacherName: teachers.teacherName,
        subjectName: subjects.subjectName,
        roomName: rooms.roomName,
        conflictStartHour: times.startTime,
        conflictDuration: times.endTime,
      })
      .from(schedules)
      .innerJoin(teachers, eq(schedules.teacherId, teachers.teacherId))
      .innerJoin(subjects, eq(schedules.subjectId, subjects.subjectId))
      .innerJoin(rooms, eq(schedules.roomId, rooms.roomId))
      .innerJoin(times, eq(schedules.timeId, times.timeId))
      .where(
        and(
          eq(schedules.sectionId, sectionId),
          eq(schedules.dayId, dayRecord.dayId)
        )
      );

    // Convert the requested time to minutes for comparison
    const requestedStartMinutes = startHour * 60;
    const requestedEndMinutes = requestedStartMinutes + duration;

    // Check if there's any overlap with existing room schedules
    const hasRoomConflict = roomConflicts.some((conflict) => {
      const conflictStartMinutes =
        parseInt(conflict.conflictStartHour.split(":")[0]) * 60;
      const conflictEndMinutes =
        parseInt(conflict.conflictDuration.split(":")[0]) * 60;

      return (
        requestedStartMinutes < conflictEndMinutes &&
        requestedEndMinutes > conflictStartMinutes
      );
    });

    // Check if there's any overlap with existing section schedules
    const hasSectionConflict = sectionConflicts.some((conflict) => {
      const conflictStartMinutes =
        parseInt(conflict.conflictStartHour.split(":")[0]) * 60;
      const conflictEndMinutes =
        parseInt(conflict.conflictDuration.split(":")[0]) * 60;

      return (
        requestedStartMinutes < conflictEndMinutes &&
        requestedEndMinutes > conflictStartMinutes
      );
    });

    if (hasRoomConflict || hasSectionConflict) {
      return Response.json(
        {
          error: "Schedule conflict detected",
          conflicts: {
            room: hasRoomConflict ? roomConflicts : [],
            section: hasSectionConflict ? sectionConflicts : [],
          },
        },
        { status: 409 }
      );
    }

    // Create the schedule
    const [newSchedule] = await db
      .insert(schedules)
      .values({
        classId: defaultClass.classId,
        teacherId,
        subjectId,
        roomId,
        dayId: dayRecord.dayId,
        timeId: timeRecord.timeId,
        sectionId,
      })
      .returning();

    return Response.json({
      success: true,
      data: newSchedule,
    });
  } catch (error) {
    console.error("Error assigning subject:", error);
    return Response.json(
      { error: "Failed to assign subject" },
      { status: 500 }
    );
  }
}
