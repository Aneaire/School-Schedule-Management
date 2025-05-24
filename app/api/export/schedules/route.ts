// app/api/export/schedules/route.ts

import { eq } from "drizzle-orm";
import ExcelJS from "exceljs";
import { NextRequest } from "next/server";
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

// Helper function to convert "HH:MM" time string to total minutes from midnight
const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

// Helper function to format minutes back to "HH:MM" (internal use)
const minutesToTime = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
};

// Helper function to format time to 12-hour format with AM/PM (e.g., "7:00 AM", "1:30 PM")
const formatTimeTo12Hour = (time: string): string => {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  // Convert 24-hour format to 12-hour format
  const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  return `${displayHour}:${minutes.toString().padStart(2, "0")} ${period}`;
};

// Helper function to generate 30-minute time slots from 7:00 AM to 7:00 PM
const generateTimeSlots = () => {
  const slots = [];
  const startMinutes = 7 * 60; // 7:00 AM
  const endMinutes = 19 * 60; // 7:00 PM

  for (
    let totalMinutes = startMinutes;
    totalMinutes <= endMinutes;
    totalMinutes += 30
  ) {
    slots.push(minutesToTime(totalMinutes));
  }
  return slots;
};

// Helper function to generate a consistent color hex for subjects
const generateSubjectHexColor = (subjectName: string): string => {
  const colors = [
    "FFEB9C", // Light Red (Hex without #)
    "BDD7EE", // Light Blue
    "C6EFCE", // Light Green
    "FFF2CC", // Light Yellow
    "E2EFDA", // Light Purple
    "FDEBF7", // Light Pink
    "DDEBF7", // Light Indigo
    "FFD966", // Light Orange
    "D0F0E0", // Light Teal
    "E0FFFF", // Light Cyan
    "E6FFB3", // Light Lime
    "CFFFE5", // Light Emerald
  ];

  let hash = 0;
  for (let i = 0; i < subjectName.length; i++) {
    hash = subjectName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sectionIdParam = searchParams.get("sectionId");
    const roomIdParam = searchParams.get("roomId");
    const teacherIdParam = searchParams.get("teacherId"); // Get the teacherId parameter

    let scheduleQuery;
    let title = "Schedule"; // Default title
    let isFilteringByRoom = false; // Flag to conditionally show section in cell
    let isFilteringByTeacher = false; // Flag to conditionally show room/section in cell

    if (sectionIdParam) {
      const sectionId = parseInt(sectionIdParam);
      if (isNaN(sectionId)) {
        return new Response(JSON.stringify({ error: "Invalid sectionId" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
      scheduleQuery = db
        .select({
          scheduleId: schedules.scheduleId,
          subjectName: subjects.subjectName,
          dayName: days.dayName,
          startTime: times.startTime,
          endTime: times.endTime,
          roomCode: rooms.roomCode,
          roomName: rooms.roomName,
          teacherName: teachers.teacherName,
          sectionName: sections.sectionName,
        })
        .from(schedules)
        .leftJoin(subjects, eq(subjects.subjectId, schedules.subjectId))
        .leftJoin(days, eq(days.dayId, schedules.dayId))
        .leftJoin(times, eq(times.timeId, schedules.timeId))
        .leftJoin(rooms, eq(rooms.roomId, schedules.roomId))
        .leftJoin(teachers, eq(teachers.teacherId, schedules.teacherId))
        .leftJoin(sections, eq(sections.sectionId, schedules.sectionId))
        .where(eq(schedules.sectionId, sectionId));

      // Fetch section name for the title
      const sectionInfo = await db
        .select({ name: sections.sectionName })
        .from(sections)
        .where(eq(sections.sectionId, sectionId))
        .limit(1);
      if (sectionInfo.length > 0) {
        title = `Schedule for ${sectionInfo[0].name}`;
      } else {
        title = `Schedule for Section ID ${sectionId}`;
      }
    } else if (roomIdParam) {
      const roomId = parseInt(roomIdParam);
      if (isNaN(roomId)) {
        return new Response(JSON.stringify({ error: "Invalid roomId" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
      scheduleQuery = db
        .select({
          scheduleId: schedules.scheduleId,
          subjectName: subjects.subjectName,
          dayName: days.dayName,
          startTime: times.startTime,
          endTime: times.endTime,
          roomCode: rooms.roomCode,
          roomName: rooms.roomName,
          teacherName: teachers.teacherName,
          sectionName: sections.sectionName,
        })
        .from(schedules)
        .leftJoin(subjects, eq(subjects.subjectId, schedules.subjectId))
        .leftJoin(days, eq(days.dayId, schedules.dayId))
        .leftJoin(times, eq(times.timeId, schedules.timeId))
        .leftJoin(rooms, eq(rooms.roomId, schedules.roomId))
        .leftJoin(teachers, eq(teachers.teacherId, schedules.teacherId))
        .leftJoin(sections, eq(sections.sectionId, schedules.sectionId))
        .where(eq(schedules.roomId, roomId));

      isFilteringByRoom = true; // Set flag

      // Fetch room info for the title
      const roomInfo = await db
        .select({ name: rooms.roomName, code: rooms.roomCode })
        .from(rooms)
        .where(eq(rooms.roomId, roomId))
        .limit(1);
      if (roomInfo.length > 0) {
        title = `Schedule for Room ${roomInfo[0].code || roomInfo[0].name}`;
      } else {
        title = `Schedule for Room ID ${roomId}`;
      }
    } else if (teacherIdParam) {
      // Handle teacherId parameter
      const teacherId = parseInt(teacherIdParam);
      if (isNaN(teacherId)) {
        return new Response(JSON.stringify({ error: "Invalid teacherId" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
      scheduleQuery = db
        .select({
          scheduleId: schedules.scheduleId,
          subjectName: subjects.subjectName,
          dayName: days.dayName,
          startTime: times.startTime,
          endTime: times.endTime,
          roomCode: rooms.roomCode,
          roomName: rooms.roomName,
          teacherName: teachers.teacherName,
          sectionName: sections.sectionName, // Include sectionName for teacher query
        })
        .from(schedules)
        .leftJoin(subjects, eq(subjects.subjectId, schedules.subjectId))
        .leftJoin(days, eq(days.dayId, schedules.dayId))
        .leftJoin(times, eq(times.timeId, schedules.timeId))
        .leftJoin(rooms, eq(rooms.roomId, schedules.roomId))
        .leftJoin(teachers, eq(teachers.teacherId, schedules.teacherId))
        .leftJoin(sections, eq(sections.sectionId, schedules.sectionId))
        .where(eq(schedules.teacherId, teacherId));

      isFilteringByTeacher = true; // Set flag

      // Fetch teacher name for the title
      const teacherInfo = await db
        .select({ name: teachers.teacherName })
        .from(teachers)
        .where(eq(teachers.teacherId, teacherId))
        .limit(1);
      if (teacherInfo.length > 0) {
        title = `Schedule for ${teacherInfo[0].name}`;
      } else {
        title = `Schedule for Teacher ID ${teacherId}`;
      }
    } else {
      // If none of sectionId, roomId, or teacherId are provided
      return new Response(
        JSON.stringify({
          error: "Missing sectionId, roomId, or teacherId parameter",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Ensure scheduleQuery is defined before awaiting
    if (!scheduleQuery) {
      // This case should ideally not happen with the current logic,
      // but added as a safeguard.
      return new Response(
        JSON.stringify({ error: "Invalid parameters provided" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const schedulesResult: any[] = await scheduleQuery; // Use any for fetched data

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(title);

    const timeSlots = generateTimeSlots();
    const dayColumns = DAYS;

    // Define columns
    worksheet.columns = [
      { header: "Time", key: "time", width: 12 }, // Adjusted width slightly for AM/PM
      ...dayColumns.map((day) => ({
        header: day.substring(0, 3).toUpperCase(),
        key: day.toLowerCase(),
        width: 15,
      })), // Shorter day headers, smaller width
    ];

    // Set up headers (Day names across the top) - Get the row after defining columns
    const headerRow = worksheet.getRow(1);

    // Apply header styling
    headerRow.eachCell((cell, colIndex) => {
      cell.font = { bold: true, size: 10, color: { argb: "FFFFFFFF" } }; // Smaller font size
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF333333" }, // Dark gray background
      };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = {
        top: { style: "thin", color: { argb: "FFCCCCCC" } },
        left: { style: "thin", color: { argb: "FFCCCCCC" } },
        bottom: { style: "thin", color: { argb: "FFCCCCCC" } },
        right: { style: "thin", color: { argb: "FFCCCCCC" } },
      };
    });

    // Add time rows and populate schedule entries
    timeSlots.forEach((timeSlot, rowIndex) => {
      const currentRow = worksheet.getRow(rowIndex + 2); // Start from row 2
      currentRow.height = 25; // Smaller row height

      // Add the time label to the first cell (Column A) - Use 12-hour format
      currentRow.getCell(1).value = formatTimeTo12Hour(timeSlot);
      currentRow.getCell(1).font = { bold: true, size: 8 }; // Smaller font size for time
      currentRow.getCell(1).alignment = {
        horizontal: "center",
        vertical: "middle",
      };
      currentRow.getCell(1).border = {
        top: { style: "thin", color: { argb: "FFCCCCCC" } },
        left: { style: "thin", color: { argb: "FFCCCCCC" } },
        bottom: { style: "thin", color: { argb: "FFCCCCCC" } },
        right: { style: "thin", color: { argb: "FFCCCCCC" } },
      };

      dayColumns.forEach((day, colIndex) => {
        // Excel column index for the current day (starts from 2 for Monday)
        const excelColIndex = colIndex + 2;
        const currentCell = currentRow.getCell(excelColIndex); // Cell for the day and time slot

        // Find schedules that start *exactly* in this time slot for this day
        const schedulesStartingAtSlot = schedulesResult.filter(
          (s) =>
            s.dayName === day &&
            timeToMinutes(s.startTime) === timeToMinutes(timeSlot)
        );

        if (schedulesStartingAtSlot.length > 0) {
          schedulesStartingAtSlot.forEach((schedule) => {
            const startRowIndex = timeSlots.indexOf(timeSlot) + 2; // Excel row index (1-based)
            const startColIndex = dayColumns.indexOf(day) + 2; // Excel column index (1-based)
            const endMinutes = timeToMinutes(schedule.endTime);
            const startMinutes = timeToMinutes(schedule.startTime);
            const durationMinutes = endMinutes - startMinutes;
            const spanInSlots = Math.max(1, Math.ceil(durationMinutes / 30)); // Minimum 1 slot span

            const endRowIndex = startRowIndex + spanInSlots - 1; // Calculate the end row index

            // Merge cells for the schedule block
            worksheet.mergeCells(
              startRowIndex,
              startColIndex,
              endRowIndex,
              startColIndex
            );

            // Get the primary cell (top-left of the merged block)
            const primaryCell = worksheet.getCell(startRowIndex, startColIndex);

            // Set cell value based on who is being filtered
            let cellValue = `${schedule.subjectName}`;

            if (isFilteringByTeacher) {
              // When filtering by teacher, show Room and Section
              cellValue += `\n${schedule.roomCode}`;
              cellValue += `\n${schedule.sectionName}`;
            } else if (isFilteringByRoom) {
              // When filtering by room, show Teacher and Section
              cellValue += `\n${schedule.teacherName}`;
              cellValue += `\n${schedule.sectionName}`;
            } else {
              // Filtering by section
              // When filtering by section, show Teacher and Room
              cellValue += `\n${schedule.roomCode}`;
              cellValue += `\n${schedule.teacherName}`;
            }

            primaryCell.value = cellValue;

            // Apply formatting
            primaryCell.alignment = {
              horizontal: "center",
              vertical: "middle",
              wrapText: true,
            };
            primaryCell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: generateSubjectHexColor(schedule.subjectName) },
            };
            primaryCell.border = {
              top: { style: "thin", color: { argb: "FFAAAAAA" } },
              left: { style: "thin", color: { argb: "FFAAAAAA" } },
              bottom: { style: "thin", color: { argb: "FFAAAAAA" } },
              right: { style: "thin", color: { argb: "FFAAAAAA" } },
            };
            primaryCell.font = { bold: true, size: 8 }; // Smaller font size for block content
          });
        } else {
          // For cells not containing the start of a schedule block,
          // apply basic styling/border if the cell hasn't been merged
          const cell = worksheet.getCell(rowIndex + 2, excelColIndex); // Use excelColIndex here
          if (!cell.isMerged) {
            cell.border = {
              top: { style: "thin", color: { argb: "FFEEEEEE" } },
              left: { style: "thin", color: { argb: "FFEEEEEE" } },
              bottom: { style: "thin", color: { argb: "FFEEEEEE" } },
              right: { style: "thin", color: { argb: "FFEEEEEE" } },
            };
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFF7F7F7" },
            };
          }
        }
      });
    });

    // Ensure consistent height for all rows after merges (already set in the loop)
    // worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
    //     if (rowNumber > 1) { // Exclude header row
    //        row.height = 25; // Reapply height
    //     }
    // });

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Set headers for file download
    const headers = new Headers();
    headers.append(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    headers.append(
      "Content-Disposition",
      `attachment; filename="${title
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .replace(/\s+/g, "_")}_schedule.xlsx"`
    );

    return new Response(buffer, {
      headers: headers,
    });
  } catch (error) {
    console.error("Error exporting schedule:", error);
    return new Response(
      JSON.stringify({ error: "Failed to export schedule" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
