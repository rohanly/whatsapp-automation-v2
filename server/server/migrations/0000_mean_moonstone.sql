CREATE TABLE `people_to_relation_types` (
	`id` text PRIMARY KEY NOT NULL,
	`person_id` text NOT NULL,
	`relation_type_id` text NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `people` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`date_of_birth` text,
	`salutation` text,
	`meta_data` text,
	`additional_info` text,
	`image` text,
	`email` text,
	`gender` text NOT NULL,
	`mobile` text,
	`extended_family` integer,
	`family_relation` text,
	`company` text,
	`social_link` text,
	`ex` integer,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `relation_types` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`chapter` text,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);