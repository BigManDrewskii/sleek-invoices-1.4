-- AI Credits tracking for Smart Compose and other AI features
CREATE TABLE IF NOT EXISTS `aiCredits` (
  `id` int AUTO_INCREMENT NOT NULL,
  `userId` int NOT NULL,
  `month` varchar(7) NOT NULL,
  `creditsUsed` int NOT NULL DEFAULT 0,
  `creditsLimit` int NOT NULL DEFAULT 5,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `aiCredits_id` PRIMARY KEY(`id`),
  CONSTRAINT `ai_credits_user_month_idx` UNIQUE(`userId`, `month`)
);

-- AI Usage logs for tracking and debugging AI features
CREATE TABLE IF NOT EXISTS `aiUsageLogs` (
  `id` int AUTO_INCREMENT NOT NULL,
  `userId` int NOT NULL,
  `feature` enum('smart_compose', 'categorization', 'prediction') NOT NULL,
  `inputTokens` int NOT NULL DEFAULT 0,
  `outputTokens` int NOT NULL DEFAULT 0,
  `model` varchar(100) NOT NULL,
  `success` boolean DEFAULT true NOT NULL,
  `errorMessage` text,
  `latencyMs` int,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  CONSTRAINT `aiUsageLogs_id` PRIMARY KEY(`id`)
);

-- Add index for faster lookups
CREATE INDEX `aiUsageLogs_userId_idx` ON `aiUsageLogs` (`userId`);
CREATE INDEX `aiUsageLogs_createdAt_idx` ON `aiUsageLogs` (`createdAt`);
