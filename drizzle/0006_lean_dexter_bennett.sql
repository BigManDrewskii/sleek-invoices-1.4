ALTER TABLE `expenses` MODIFY COLUMN `paymentMethod` enum('cash','credit_card','debit_card','bank_transfer','check','other');--> statement-breakpoint
ALTER TABLE `expenses` ADD `receiptKey` text;--> statement-breakpoint
ALTER TABLE `expenses` ADD `taxAmount` decimal(10,2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE `expenses` ADD `isBillable` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `expenses` ADD `clientId` int;--> statement-breakpoint
ALTER TABLE `expenses` ADD `invoiceId` int;