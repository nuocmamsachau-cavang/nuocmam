CREATE TABLE `adCampaigns` (
	`id` int AUTO_INCREMENT NOT NULL,
	`platform` enum('google','facebook','tiktok') NOT NULL,
	`externalId` varchar(255) NOT NULL,
	`accountId` varchar(255),
	`name` varchar(255) NOT NULL,
	`status` enum('active','paused','ended','unknown') NOT NULL DEFAULT 'unknown',
	`objective` varchar(255),
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `adCampaigns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `adMetrics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`campaignId` int NOT NULL,
	`metricDate` timestamp NOT NULL,
	`spend` decimal(12,2) NOT NULL DEFAULT '0',
	`impressions` int NOT NULL DEFAULT 0,
	`clicks` int NOT NULL DEFAULT 0,
	`conversions` int NOT NULL DEFAULT 0,
	`conversionValue` decimal(12,2) NOT NULL DEFAULT '0',
	`ctr` decimal(8,4) NOT NULL DEFAULT '0',
	`cpc` decimal(12,4) NOT NULL DEFAULT '0',
	`cpm` decimal(12,4) NOT NULL DEFAULT '0',
	`rawData` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `adMetrics_id` PRIMARY KEY(`id`)
);
