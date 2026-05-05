CREATE TABLE `emailConfig` (
	`id` int AUTO_INCREMENT NOT NULL,
	`smtpServer` varchar(255) NOT NULL,
	`smtpPort` int NOT NULL,
	`smtpUser` varchar(255) NOT NULL,
	`smtpPassword` varchar(512) NOT NULL,
	`fromEmail` varchar(320) NOT NULL,
	`toEmail` varchar(320) NOT NULL,
	`isActive` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `emailConfig_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `promotions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(64) NOT NULL,
	`discountPercent` int NOT NULL,
	`startDate` timestamp NOT NULL,
	`endDate` timestamp NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`usageCount` int NOT NULL DEFAULT 0,
	`maxUsage` int,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `promotions_id` PRIMARY KEY(`id`),
	CONSTRAINT `promotions_code_unique` UNIQUE(`code`)
);
