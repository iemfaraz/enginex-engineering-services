CREATE TABLE `admin_sessions` (
	`token_hash` text PRIMARY KEY NOT NULL,
	`expires` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `login_codes` (
	`code_hash` text PRIMARY KEY NOT NULL,
	`challenge` text NOT NULL,
	`expires` integer NOT NULL
);
