CREATE TABLE `site_settings` (
	`id` text PRIMARY KEY NOT NULL,
	`payload` text NOT NULL,
	`version` integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE `quotes` ADD `extra` text DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE `quotes` ADD `photos` text DEFAULT '[]' NOT NULL;