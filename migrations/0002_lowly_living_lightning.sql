ALTER TABLE `teachers` ADD `employee_id` text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `teachers_employee_id_unique` ON `teachers` (`employee_id`);