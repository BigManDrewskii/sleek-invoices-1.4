-- Add email delivery tracking columns to emailLog table
ALTER TABLE `emailLog` ADD COLUMN `messageId` varchar(100);
ALTER TABLE `emailLog` ADD COLUMN `deliveryStatus` enum('sent','delivered','opened','clicked','bounced','complained','failed') DEFAULT 'sent';
ALTER TABLE `emailLog` ADD COLUMN `deliveredAt` timestamp;
ALTER TABLE `emailLog` ADD COLUMN `openedAt` timestamp;
ALTER TABLE `emailLog` ADD COLUMN `openCount` int DEFAULT 0;
ALTER TABLE `emailLog` ADD COLUMN `clickedAt` timestamp;
ALTER TABLE `emailLog` ADD COLUMN `clickCount` int DEFAULT 0;
ALTER TABLE `emailLog` ADD COLUMN `bouncedAt` timestamp;
ALTER TABLE `emailLog` ADD COLUMN `bounceType` varchar(50);
