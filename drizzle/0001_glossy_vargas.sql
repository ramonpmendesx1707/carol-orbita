CREATE TABLE IF NOT EXISTS `cc_attempts` (
	`id` text PRIMARY KEY NOT NULL,
	`attempts` integer NOT NULL,
	`since` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `cc_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`expires` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `cc_backups` (
	`id` text PRIMARY KEY NOT NULL,
	`payload` text NOT NULL,
	`created` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `cc_contacts` (
	`id` text PRIMARY KEY NOT NULL,
	`payload` text NOT NULL,
	`html` text NOT NULL,
	`status` text NOT NULL,
	`created` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `cc_state` (
	`id` text PRIMARY KEY NOT NULL,
	`payload` text NOT NULL,
	`revision` integer DEFAULT 1 NOT NULL
);
