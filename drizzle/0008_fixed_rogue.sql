CREATE TABLE `sections` (
	`section_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`section_name` text NOT NULL,
	`year` integer NOT NULL,
	`course_id` integer NOT NULL,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`course_id`) ON UPDATE no action ON DELETE no action
);
