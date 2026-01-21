-- Add retry tracking columns to emailLog table
ALTER TABLE `emailLog` ADD COLUMN `retryCount` int DEFAULT 0;
ALTER TABLE `emailLog` ADD COLUMN `lastRetryAt` timestamp;
ALTER TABLE `emailLog` ADD COLUMN `nextRetryAt` timestamp;
