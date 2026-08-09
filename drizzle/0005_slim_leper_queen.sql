CREATE TABLE `websiteSettings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(255) NOT NULL,
	`value` text NOT NULL,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `websiteSettings_id` PRIMARY KEY(`id`),
	CONSTRAINT `websiteSettings_key_unique` UNIQUE(`key`)
);
