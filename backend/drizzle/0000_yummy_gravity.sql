CREATE TABLE `quotes` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`email` text NOT NULL,
	`service` text NOT NULL,
	`city` text NOT NULL,
	`details` text NOT NULL,
	`status` text DEFAULT 'New' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`ip_hash` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `quotes_created_idx` ON `quotes` (`created_at`);--> statement-breakpoint
CREATE INDEX `quotes_ip_idx` ON `quotes` (`ip_hash`,`created_at`);