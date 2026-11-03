CREATE TABLE `quote_events` (
	`id` text PRIMARY KEY NOT NULL,
	`quote_id` text NOT NULL,
	`created` integer NOT NULL,
	`status` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `quote_events_quote_idx` ON `quote_events` (`quote_id`,`created`);--> statement-breakpoint
CREATE TABLE `quote_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`quote_id` text NOT NULL,
	`created` integer NOT NULL,
	`author` text NOT NULL,
	`body` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `quote_messages_quote_idx` ON `quote_messages` (`quote_id`,`created`);--> statement-breakpoint
CREATE TABLE `quote_notifications` (
	`quote_id` text PRIMARY KEY NOT NULL,
	`created` integer NOT NULL,
	`state` text NOT NULL,
	`error` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
ALTER TABLE `quotes` ADD `workflow` text DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE `quotes` ADD `version` integer DEFAULT 0 NOT NULL;