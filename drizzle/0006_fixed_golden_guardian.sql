PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_teacher_subjects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`teacher_id` integer NOT NULL,
	`subject_id` integer NOT NULL,
	`classroom_id` integer NOT NULL,
	`start_hour` integer NOT NULL,
	`duration` integer NOT NULL,
	`day` text NOT NULL,
	FOREIGN KEY (`teacher_id`) REFERENCES `teachers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`classroom_id`) REFERENCES `classrooms`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_teacher_subjects`("id", "teacher_id", "subject_id", "classroom_id", "start_hour", "duration", "day") SELECT "id", "teacher_id", "subject_id", "classroom_id", "start_hour", "duration", "day" FROM `teacher_subjects`;--> statement-breakpoint
DROP TABLE `teacher_subjects`;--> statement-breakpoint
ALTER TABLE `__new_teacher_subjects` RENAME TO `teacher_subjects`;--> statement-breakpoint
PRAGMA foreign_keys=ON;