// app/api/export/schedules/route.ts

import { eq } from "drizzle-orm";
import ExcelJS from "exceljs";
import { NextRequest } from "next/server";
import {
  days,
  rooms,
  schedules,
  sections,
  subjectColors,
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

// Enhanced color generation with 100+ distinct colors
const generateSubjectHexColor = (subjectName: string): string => {
  const colors = [
    // Reds & Pinks (20 colors)
    "FFEBEE",
    "FFCDD2",
    "EF9A9A",
    "E57373",
    "EF5350",
    "F44336",
    "E53935",
    "D32F2F",
    "C62828",
    "B71C1C",
    "FCE4EC",
    "F8BBD9",
    "F48FB1",
    "F06292",
    "EC407A",
    "E91E63",
    "D81B60",
    "C2185B",
    "AD1457",
    "880E4F",

    // Oranges & Ambers (20 colors)
    "FFF3E0",
    "FFE0B2",
    "FFCC80",
    "FFB74D",
    "FFA726",
    "FF9800",
    "FB8C00",
    "F57C00",
    "EF6C00",
    "E65100",
    "FFFBF0",
    "FFEAA7",
    "FDCB6E",
    "E17055",
    "D63031",
    "FFF8E1",
    "FFECB3",
    "FFE082",
    "FFD54F",
    "FFCA28",

    // Yellows & Limes (20 colors)
    "FFFDE7",
    "FFF9C4",
    "FFF59D",
    "FFF176",
    "FFEE58",
    "FFEB3B",
    "FDD835",
    "F9A825",
    "F57F17",
    "FF8F00",
    "F0F4C3",
    "E6EE9C",
    "DCE775",
    "D4E157",
    "CDDC39",
    "C0CA33",
    "AFB42B",
    "9E9D24",
    "827717",
    "F4FF81",

    // Greens (20 colors)
    "E8F5E8",
    "C8E6C9",
    "A5D6A7",
    "81C784",
    "66BB6A",
    "4CAF50",
    "43A047",
    "388E3C",
    "2E7D32",
    "1B5E20",
    "F1F8E9",
    "DCEDC8",
    "C5E1A5",
    "AED581",
    "9CCC65",
    "8BC34A",
    "7CB342",
    "689F38",
    "558B2F",
    "33691E",

    // Teals & Cyans (20 colors)
    "E0F2F1",
    "B2DFDB",
    "80CBC4",
    "4DB6AC",
    "26A69A",
    "009688",
    "00897B",
    "00796B",
    "00695C",
    "004D40",
    "E0F7FA",
    "B2EBF2",
    "81D4FA",
    "4FC3F7",
    "29B6F6",
    "03A9F4",
    "039BE5",
    "0288D1",
    "0277BD",
    "01579B",

    // Blues (20 colors)
    "E3F2FD",
    "BBDEFB",
    "90CAF9",
    "64B5F6",
    "42A5F5",
    "2196F3",
    "1E88E5",
    "1976D2",
    "1565C0",
    "0D47A1",
    "E8EAF6",
    "C5CAE9",
    "9FA8DA",
    "7986CB",
    "5C6BC0",
    "3F51B5",
    "3949AB",
    "303F9F",
    "283593",
    "1A237E",

    // Purples & Violets (20 colors)
    "F3E5F5",
    "E1BEE7",
    "CE93D8",
    "BA68C8",
    "AB47BC",
    "9C27B0",
    "8E24AA",
    "7B1FA2",
    "6A1B9A",
    "4A148C",
    "EDE7F6",
    "D1C4E9",
    "B39DDB",
    "9575CD",
    "7E57C2",
    "673AB7",
    "5E35B1",
    "512DA8",
    "4527A0",
    "311B92",

    // Browns & Grays (20 colors)
    "EFEBE9",
    "D7CCC8",
    "BCAAA4",
    "A1887F",
    "8D6E63",
    "795548",
    "6D4C41",
    "5D4037",
    "4E342E",
    "3E2723",
    "FAFAFA",
    "F5F5F5",
    "EEEEEE",
    "E0E0E0",
    "BDBDBD",
    "9E9E9E",
    "757575",
    "616161",
    "424242",
    "212121",

    // Exotic & Unique Colors (20 colors)
    "FFF8DC",
    "F0E68C",
    "DDA0DD",
    "98FB98",
    "F0FFF0",
    "FFE4E1",
    "FFDEAD",
    "D2B48C",
    "BC8F8F",
    "F4A460",
    "87CEEB",
    "98D8E8",
    "F0E6FF",
    "E6E6FA",
    "FFB6C1",
    "FFA07A",
    "20B2AA",
    "87CEFA",
    "778899",
    "B0C4DE",

    // Pastel Colors (20 colors)
    "FFEEF0",
    "FFE5E7",
    "FFDBDD",
    "FFD1D4",
    "FFC7CA",
    "FFBDC1",
    "FFB3B7",
    "FFA9AE",
    "FF9FA4",
    "FF959B",
    "E5F7FF",
    "DBF3FF",
    "D1EFFF",
    "C7EBFF",
    "BDE7FF",
    "B3E3FF",
    "A9DFFF",
    "9FDBFF",
    "95D7FF",
    "8BD3FF",
  ];

  let hash = 0;
  for (let i = 0; i < subjectName.length; i++) {
    hash = subjectName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

// Function to generate a dark color for subjects, ensuring good contrast with white text
const generateDarkSubjectColor = (subjectName: string): string => {
  let hash = 0;
  for (let i = 0; i < subjectName.length; i++) {
    hash = subjectName.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Generate darker colors suitable for white text
  const hue = Math.abs(hash) % 360; // 0-359 degrees
  const saturation = 60 + (Math.abs(hash >> 8) % 40); // 60-100% saturation
  const lightness = 25 + (Math.abs(hash >> 16) % 35); // 25-60% lightness (darker)

  // Convert HSL to RGB
  const hslToRgb = (h: number, s: number, l: number) => {
    h /= 360;
    s /= 100;
    l /= 100;

    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
      const k = (n + h * 12) % 12;
      return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    };

    return [
      Math.round(f(0) * 255),
      Math.round(f(8) * 255),
      Math.round(f(4) * 255),
    ];
  };

  const [r, g, b] = hslToRgb(hue, saturation, lightness);
  return `FF${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`.toUpperCase();
};

const getContrastColor = (backgroundColor: string): string => {
  // Remove FF prefix if present and convert to RGB
  const hex = backgroundColor.replace(/^FF/, "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return white for dark backgrounds, black for light backgrounds
  return luminance < 0.5 ? "FFFFFFFF" : "FF000000";
};

async function getOrAssignSubjectColor(subjectName: string): Promise<string> {
  const existing = await db
    .select({ colorHex: subjectColors.colorHex })
    .from(subjectColors)
    .where(eq(subjectColors.subjectName, subjectName));

  if (existing.length > 0) return existing[0].colorHex;

  const newColor = generateDarkSubjectColor(subjectName); // your hash function

  await db.insert(subjectColors).values({
    subjectName,
    colorHex: newColor,
  });

  return newColor;
}

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// Cache for subject colors to avoid repeated database queries
const colorCache = new Map<string, string>();

async function getOrCacheColor(subjectName: string): Promise<string> {
  if (colorCache.has(subjectName)) return colorCache.get(subjectName)!;
  const color = await getOrAssignSubjectColor(subjectName);
  colorCache.set(subjectName, color);
  return color;
}

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
    for (let rowIndex = 0; rowIndex < timeSlots.length; rowIndex++) {
      const timeSlot = timeSlots[rowIndex];
      const currentRow = worksheet.getRow(rowIndex + 2); // Start from row 2
      currentRow.height = 25;

      currentRow.getCell(1).value = formatTimeTo12Hour(timeSlot);
      currentRow.getCell(1).font = { bold: true, size: 8 };
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

      for (let colIndex = 0; colIndex < dayColumns.length; colIndex++) {
        const day = dayColumns[colIndex];
        const excelColIndex = colIndex + 2;
        const currentCell = currentRow.getCell(excelColIndex);

        const schedulesStartingAtSlot = schedulesResult.filter(
          (s) =>
            s.dayName === day &&
            timeToMinutes(s.startTime) === timeToMinutes(timeSlot)
        );

        if (schedulesStartingAtSlot.length > 0) {
          for (const schedule of schedulesStartingAtSlot) {
            const startRowIndex = timeSlots.indexOf(timeSlot) + 2;
            const startColIndex = dayColumns.indexOf(day) + 2;
            const endMinutes = timeToMinutes(schedule.endTime);
            const startMinutes = timeToMinutes(schedule.startTime);
            const durationMinutes = endMinutes - startMinutes;
            const spanInSlots = Math.max(1, Math.ceil(durationMinutes / 30));
            const endRowIndex = startRowIndex + spanInSlots - 1;

            worksheet.mergeCells(
              startRowIndex,
              startColIndex,
              endRowIndex,
              startColIndex
            );

            const primaryCell = worksheet.getCell(startRowIndex, startColIndex);

            let cellValue = `${schedule.subjectName}`;
            if (isFilteringByTeacher) {
              cellValue += `\n${schedule.roomCode}`;
              cellValue += `\n${schedule.sectionName}`;
            } else if (isFilteringByRoom) {
              cellValue += `\n${schedule.teacherName}`;
              cellValue += `\n${schedule.sectionName}`;
            } else {
              cellValue += `\n${schedule.roomCode}`;
              cellValue += `\n${schedule.teacherName}`;
            }

            const subjectColor = await getOrCacheColor(schedule.subjectName);

            primaryCell.value = cellValue;
            primaryCell.alignment = {
              horizontal: "center",
              vertical: "middle",
              wrapText: true,
            };
            primaryCell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: subjectColor },
            };
            primaryCell.border = {
              top: { style: "thin", color: { argb: "FFAAAAAA" } },
              left: { style: "thin", color: { argb: "FFAAAAAA" } },
              bottom: { style: "thin", color: { argb: "FFAAAAAA" } },
              right: { style: "thin", color: { argb: "FFAAAAAA" } },
            };
            // CHANGE THIS LINE - Add white text color
            primaryCell.font = {
              bold: true,
              size: 8,
              color: { argb: "FFFFFFFF" }, // White text color
            };
          }
        } else {
          const cell = worksheet.getCell(rowIndex + 2, excelColIndex);
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
      }
    }

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
