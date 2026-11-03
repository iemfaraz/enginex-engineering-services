CREATE TABLE `quote_counters` (
	`day` text PRIMARY KEY NOT NULL,
	`sequence` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `quote_uploads` (
	`id` text PRIMARY KEY NOT NULL,
	`quote_id` text NOT NULL,
	`token_hash` text NOT NULL,
	`upload_id` text NOT NULL,
	`name` text NOT NULL,
	`mime` text NOT NULL,
	`size` integer NOT NULL,
	`created` integer NOT NULL,
	`ip_hash` text NOT NULL,
	`state` text DEFAULT 'uploading' NOT NULL
);
--> statement-breakpoint
CREATE INDEX `quote_uploads_ip_idx` ON `quote_uploads` (`ip_hash`,`created`);--> statement-breakpoint
ALTER TABLE `quotes` ADD `reference` text;--> statement-breakpoint
CREATE UNIQUE INDEX `quotes_reference_unique` ON `quotes` (`reference`);