CREATE TABLE `job_photos` (
	`id` text PRIMARY KEY NOT NULL,
	`quote_id` text NOT NULL,
	`stage` text NOT NULL,
	`name` text NOT NULL,
	`mime` text NOT NULL,
	`created` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `job_photos_quote_idx` ON `job_photos` (`quote_id`);