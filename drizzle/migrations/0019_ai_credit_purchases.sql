-- Add purchasedCredits column to aiCredits table
ALTER TABLE `aiCredits` ADD COLUMN `purchasedCredits` int NOT NULL DEFAULT 0;

-- Create aiCreditPurchases table for tracking credit pack purchases
CREATE TABLE `aiCreditPurchases` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `userId` int NOT NULL,
  `stripeSessionId` varchar(255) NOT NULL UNIQUE,
  `stripePaymentIntentId` varchar(255),
  `packType` enum('starter', 'standard', 'pro_pack') NOT NULL,
  `creditsAmount` int NOT NULL,
  `amountPaid` int NOT NULL,
  `currency` varchar(3) NOT NULL DEFAULT 'usd',
  `status` enum('pending', 'completed', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
  `appliedToMonth` varchar(7),
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `completedAt` timestamp
);

-- Add index for user lookups
CREATE INDEX `ai_credit_purchases_user_idx` ON `aiCreditPurchases` (`userId`);
