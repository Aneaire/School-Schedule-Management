CREATE TABLE `classrooms` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `classrooms_name_unique` ON `classrooms` (`name`);