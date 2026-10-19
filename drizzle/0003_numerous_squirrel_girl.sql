CREATE TABLE `uploaded_files` (
	`id` varchar(64) NOT NULL,
	`folder` varchar(50) NOT NULL,
	`filename` varchar(255) NOT NULL,
	`mime_type` varchar(100) NOT NULL,
	`file_size` int NOT NULL,
	`data` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `uploaded_files_id` PRIMARY KEY(`id`),
	CONSTRAINT `uploaded_files_filename_unique` UNIQUE(`filename`)
);
--> statement-breakpoint
CREATE TABLE `visitor_pageviews` (
	`id` varchar(64) NOT NULL,
	`session_id` varchar(64) NOT NULL,
	`path` varchar(255) NOT NULL,
	`ip_address` varchar(64) NOT NULL,
	`country_code` varchar(10),
	`country_name` varchar(100),
	`city` varchar(100),
	`referrer` text,
	`user_agent` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `visitor_pageviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `visitor_sessions` (
	`session_id` varchar(64) NOT NULL,
	`ip_address` varchar(64) NOT NULL,
	`country_code` varchar(10) DEFAULT 'ID',
	`country_name` varchar(100) DEFAULT 'Indonesia',
	`city` varchar(100),
	`current_path` varchar(255) NOT NULL DEFAULT '/',
	`device_type` varchar(20) NOT NULL DEFAULT 'desktop',
	`browser` varchar(50),
	`os` varchar(50),
	`pageview_count` int NOT NULL DEFAULT 1,
	`first_seen_at` timestamp NOT NULL DEFAULT (now()),
	`last_active_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `visitor_sessions_session_id` PRIMARY KEY(`session_id`)
);
