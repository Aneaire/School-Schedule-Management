import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Courses table
export const courses = sqliteTable("courses", {
  courseId: integer("course_id").primaryKey({ autoIncrement: true }),
  courseCode: text("course_code").notNull(),
  courseName: text("course_name").notNull(),
});

// Classes table
export const classes = sqliteTable("classes", {
  classId: integer("class_id").primaryKey({ autoIncrement: true }),
  section: text("section").notNull(),
  year: integer("year").notNull(),
  courseId: integer("course_id")
    .references(() => courses.courseId)
    .notNull(),
  roomId: integer("room_id")
    .references(() => rooms.roomId)
    .notNull(),
});

// Days table
export const days = sqliteTable("days", {
  dayId: integer("day_id").primaryKey({ autoIncrement: true }),
  dayName: text("day_name").notNull(),
});

// Rooms table
export const rooms = sqliteTable("rooms", {
  roomId: integer("room_id").primaryKey({ autoIncrement: true }),
  roomCode: text("room_code").notNull(),
  roomName: text("room_name").notNull(),
});

// Times table
export const times = sqliteTable("times", {
  timeId: integer("time_id").primaryKey({ autoIncrement: true }),
  startTime: text("start_time").notNull(), // Format: "HH:MM"
  endTime: text("end_time").notNull(), // Format: "HH:MM"
});

// Subjects table
export const subjects = sqliteTable("subjects", {
  subjectId: integer("subject_id").primaryKey({ autoIncrement: true }),
  subjectCode: text("subject_code").notNull(),
  subjectName: text("subject_name").notNull(),
  units: integer("units").notNull(),
});

export const teachers = sqliteTable("teachers", {
  teacherId: integer("teacher_id").primaryKey({ autoIncrement: true }),
  employeeId: text("employee_id").unique().notNull(), // Added employeeId - make it unique and not null
  teacherName: text("teacher_name").notNull(),
  email: text("email").notNull(),
  imageUrl: text("image_url"),
  majorSubject: text("major_subject").notNull(),
});

// Schedules table (replaces teacherSubjects)
export const schedules = sqliteTable("schedules", {
  scheduleId: integer("schedule_id").primaryKey({ autoIncrement: true }),
  classId: integer("class_id")
    .references(() => classes.classId)
    .notNull(),
  subjectId: integer("subject_id")
    .references(() => subjects.subjectId)
    .notNull(),
  teacherId: integer("teacher_id")
    .references(() => teachers.teacherId)
    .notNull(),
  dayId: integer("day_id")
    .references(() => days.dayId)
    .notNull(),
  timeId: integer("time_id")
    .references(() => times.timeId)
    .notNull(),
  roomId: integer("room_id")
    .references(() => rooms.roomId)
    .notNull(),
  sectionId: integer("section_id")
    .references(() => sections.sectionId)
    .notNull(),
});

// Sections table
export const sections = sqliteTable("sections", {
  sectionId: integer("section_id").primaryKey({ autoIncrement: true }),
  sectionName: text("section_name").notNull(),
  year: integer("year").notNull(),
  courseId: integer("course_id")
    .references(() => courses.courseId)
    .notNull(),
});

export const subjectColors = sqliteTable("subject_colors", {
  subjectName: text("subject_name").primaryKey(),
  colorHex: text("color_hex").notNull(), // e.g., "FFD966"
});

// Export the schema object
export const schema = {
  subjectColors,
  courses,
  classes,
  days,
  rooms,
  times,
  subjects,
  teachers,
  schedules,
  sections,
};
