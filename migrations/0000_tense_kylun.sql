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
	`section_id` integer NOT NULL,
	FOREIGN KEY (`class_id`) REFERENCES `classes`(`class_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`subject_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`teacher_id`) REFERENCES `teachers`(`teacher_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`day_id`) REFERENCES `days`(`day_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`time_id`) REFERENCES `times`(`time_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`room_id`) REFERENCES `rooms`(`room_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`section_id`) REFERENCES `sections`(`section_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sections` (
	`section_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`section_name` text NOT NULL,
	`year` integer NOT NULL,
	`course_id` integer NOT NULL,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`course_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `subjects` (
	`subject_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`subject_code` text NOT NULL,
	`subject_name` text NOT NULL,
	`units` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `teachers` (
	`teacher_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`teacher_name` text NOT NULL,
	`email` text NOT NULL,
	`image_url` text,
	`major_subject` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `times` (
	`time_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`start_time` text NOT NULL,
	`end_time` text NOT NULL
);
