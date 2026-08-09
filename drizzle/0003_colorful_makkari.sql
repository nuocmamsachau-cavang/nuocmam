CREATE TABLE `blogPosts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`excerpt` text,
	`imageUrl` varchar(512),
	`imageKey` varchar(512),
	`author` varchar(255) NOT NULL DEFAULT 'Nước Mắm Cá Vàng',
	`category` varchar(100) NOT NULL DEFAULT 'Kiến Thức',
	`isPublished` boolean NOT NULL DEFAULT true,
	`viewCount` int NOT NULL DEFAULT 0,
	`publishedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `blogPosts_id` PRIMARY KEY(`id`),
	CONSTRAINT `blogPosts_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `productReviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`userId` int,
	`customerName` varchar(255) NOT NULL,
	`customerEmail` varchar(320),
	`rating` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`isApproved` boolean NOT NULL DEFAULT false,
	`helpfulCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `productReviews_id` PRIMARY KEY(`id`)
);
