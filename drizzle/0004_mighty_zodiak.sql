CREATE TABLE `productImages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`imageUrl` varchar(512) NOT NULL,
	`imageKey` varchar(512) NOT NULL,
	`displayOrder` int NOT NULL DEFAULT 1,
	`altText` varchar(255),
	`title` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `productImages_id` PRIMARY KEY(`id`)
);
