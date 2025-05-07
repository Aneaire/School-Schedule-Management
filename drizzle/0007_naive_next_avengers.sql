CREATE TABLE `classes` (
	`class_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`section` text NOT NULL,
	`year` integer NOT NULL,
	`course_id` integer NOT NULL,
	`room_id` integer NOT NULL,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`course_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`room_id`) REFERENCES `rooms`(`room_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `courses` (
	`course_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`course_code` text NOT NULL,
	`course_name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `days` (
	`day_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`day_name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `rooms` (
	`room_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`room_code` text NOT NULL,
	`room_name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `schedules` (
	`schedule_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`class_id` integer NOT NULL,
	`subject_id` integer NOT NULL,
	`teacher_id` integer NOT NULL,
	`day_id` integer NOT NULL,
	`time_id` integer NOT NULL,
	`room_id` integer NOT NULL,
	FOREIGN KEY (`class_id`) REFERENCES `classes`(`class_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`subject_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`teacher_id`) REFERENCES `teachers`(`teacher_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`day_id`) REFERENCES `days`(`day_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`time_id`) REFERENCES `times`(`time_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`room_id`) REFERENCES `rooms`(`room_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `times` (
	`time_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`start_time` text NOT NULL,
	`end_time` text NOT NULL
);
--> statement-breakpoint
DROP TABLE `classrooms`;--> statement-breakpoint
DROP TABLE `teacher_subjects`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_subjects` (
	`subject_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`subject_code` text NOT NULL,
	`subject_name` text NOT NULL,
	`units` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_subjects`("subject_id", "subject_code", "subject_name", "units") SELECT "subject_id", "subject_code", "subject_name", "units" FROM `subjects`;--> statement-breakpoint
DROP TABLE `subjects`;--> statement-breakpoint
ALTER TABLE `__new_subjects` RENAME TO `subjects`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_teachers` (
	`teacher_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`teacher_name` text NOT NULL,
	`email` text NOT NULL,
	`image_url` text,
	`major_subject` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_teachers`("teacher_id", "teacher_name", "email", "image_url", "major_subject") SELECT "teacher_id", "teacher_name", "email", "image_url", "major_subject" FROM `teachers`;--> statement-breakpoint
DROP TABLE `teachers`;--> statement-breakpoint
ALTER TABLE `__new_teachers` RENAME TO `teachers`;