CREATE TABLE `documents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`documentId` varchar(50) NOT NULL,
	`patientId` int NOT NULL,
	`documentType` enum('report','prescription','medical_history','insurance','other') NOT NULL,
	`fileName` varchar(300) NOT NULL,
	`fileSize` varchar(50),
	`mimeType` varchar(100),
	`s3Key` varchar(500) NOT NULL,
	`s3Url` varchar(500) NOT NULL,
	`uploadedBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `documents_id` PRIMARY KEY(`id`),
	CONSTRAINT `documents_documentId_unique` UNIQUE(`documentId`)
);
--> statement-breakpoint
CREATE TABLE `emailNotifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`recipientEmail` varchar(320) NOT NULL,
	`recipientName` varchar(200),
	`notificationType` enum('report_ready','urgent_test','pending_sample','payment_reminder','appointment_reminder') NOT NULL,
	`relatedId` int,
	`subject` varchar(300) NOT NULL,
	`status` enum('pending','sent','failed') NOT NULL DEFAULT 'pending',
	`sentAt` timestamp,
	`failureReason` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `emailNotifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `invoices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`invoiceId` varchar(50) NOT NULL,
	`patientId` int NOT NULL,
	`bookingIds` text,
	`invoiceDate` datetime NOT NULL,
	`dueDate` datetime,
	`subtotal` decimal(10,2) NOT NULL,
	`discount` decimal(10,2) DEFAULT '0',
	`tax` decimal(10,2) DEFAULT '0',
	`totalAmount` decimal(10,2) NOT NULL,
	`status` enum('draft','issued','paid','overdue','cancelled') NOT NULL DEFAULT 'draft',
	`paymentMethod` varchar(50),
	`paymentDate` datetime,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `invoices_id` PRIMARY KEY(`id`),
	CONSTRAINT `invoices_invoiceId_unique` UNIQUE(`invoiceId`)
);
--> statement-breakpoint
CREATE TABLE `labReports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reportId` varchar(50) NOT NULL,
	`bookingId` int NOT NULL,
	`patientId` int NOT NULL,
	`reportDate` datetime NOT NULL,
	`status` enum('draft','pending_review','approved','delivered') NOT NULL DEFAULT 'draft',
	`template` varchar(100) DEFAULT 'standard',
	`pdfUrl` varchar(500),
	`pdfStoragePath` varchar(500),
	`reportContent` text,
	`approvedBy` int,
	`approvedAt` timestamp,
	`deliveredAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `labReports_id` PRIMARY KEY(`id`),
	CONSTRAINT `labReports_reportId_unique` UNIQUE(`reportId`)
);
--> statement-breakpoint
CREATE TABLE `patients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`patientId` varchar(50) NOT NULL,
	`firstName` varchar(100) NOT NULL,
	`lastName` varchar(100) NOT NULL,
	`email` varchar(320),
	`phone` varchar(20) NOT NULL,
	`dateOfBirth` datetime NOT NULL,
	`gender` enum('male','female','other') NOT NULL,
	`bloodGroup` varchar(10),
	`address` text,
	`city` varchar(100),
	`state` varchar(100),
	`zipCode` varchar(20),
	`country` varchar(100),
	`emergencyContact` varchar(100),
	`emergencyPhone` varchar(20),
	`medicalHistory` text,
	`allergies` text,
	`currentMedications` text,
	`referringDoctor` varchar(100),
	`insurance` varchar(100),
	`insuranceId` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `patients_id` PRIMARY KEY(`id`),
	CONSTRAINT `patients_patientId_unique` UNIQUE(`patientId`)
);
--> statement-breakpoint
CREATE TABLE `reportTemplates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`templateName` varchar(100) NOT NULL,
	`category` varchar(100) NOT NULL,
	`htmlContent` text NOT NULL,
	`cssContent` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reportTemplates_id` PRIMARY KEY(`id`),
	CONSTRAINT `reportTemplates_templateName_unique` UNIQUE(`templateName`)
);
--> statement-breakpoint
CREATE TABLE `testBookings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bookingId` varchar(50) NOT NULL,
	`patientId` int NOT NULL,
	`testId` int NOT NULL,
	`bookingDate` datetime NOT NULL,
	`sampleCollectionDate` datetime,
	`sampleId` varchar(50),
	`sampleStatus` enum('pending','collected','processing','completed','rejected') NOT NULL DEFAULT 'pending',
	`status` enum('pending','in_progress','completed','cancelled') NOT NULL DEFAULT 'pending',
	`notes` text,
	`bookedBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `testBookings_id` PRIMARY KEY(`id`),
	CONSTRAINT `testBookings_bookingId_unique` UNIQUE(`bookingId`)
);
--> statement-breakpoint
CREATE TABLE `testCatalog` (
	`id` int AUTO_INCREMENT NOT NULL,
	`testCode` varchar(50) NOT NULL,
	`testName` varchar(200) NOT NULL,
	`category` varchar(100) NOT NULL,
	`description` text,
	`price` decimal(10,2) NOT NULL,
	`sampleType` varchar(100) NOT NULL,
	`sampleVolume` varchar(50),
	`sampleRequirements` text,
	`turnaroundTime` varchar(50),
	`referenceRange` text,
	`method` varchar(200),
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `testCatalog_id` PRIMARY KEY(`id`),
	CONSTRAINT `testCatalog_testCode_unique` UNIQUE(`testCode`)
);
--> statement-breakpoint
CREATE TABLE `testResults` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bookingId` int NOT NULL,
	`testId` int NOT NULL,
	`patientId` int NOT NULL,
	`resultValue` varchar(500) NOT NULL,
	`unit` varchar(50),
	`referenceMin` varchar(50),
	`referenceMax` varchar(50),
	`status` enum('normal','abnormal','critical') NOT NULL,
	`notes` text,
	`enteredBy` int NOT NULL,
	`enteredAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `testResults_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('admin','technician','receptionist','doctor','user') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` ADD `phone` varchar(20);--> statement-breakpoint
ALTER TABLE `users` ADD `department` varchar(100);--> statement-breakpoint
ALTER TABLE `users` ADD `isActive` boolean DEFAULT true NOT NULL;