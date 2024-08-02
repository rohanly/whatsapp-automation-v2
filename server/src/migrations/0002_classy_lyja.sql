CREATE TABLE `push_notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`subscription` text NOT NULL,
	`user_id` text NOT NULL,
	`browser_meta` text,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
