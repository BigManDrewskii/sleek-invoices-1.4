-- Phase 1.4: Invoice View Tracking
-- Creates invoice_views table and adds viewed status to invoices

-- 1.4.1 Create invoice_views table
CREATE TABLE `invoiceViews` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `invoiceId` INT NOT NULL,
  `viewedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ipAddress` VARCHAR(45) NULL,
  `userAgent` TEXT NULL,
  `isFirstView` BOOLEAN NOT NULL DEFAULT FALSE,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Add index for faster lookups by invoiceId
CREATE INDEX `idx_invoice_views_invoice_id` ON `invoiceViews` (`invoiceId`);

-- 1.4.3 Add firstViewedAt column to invoices table (TIMESTAMP, nullable)
ALTER TABLE `invoices`
  ADD COLUMN `firstViewedAt` TIMESTAMP NULL;

-- Note: 1.4.2 (Add 'viewed' to invoice status enum) requires schema.ts update
-- MySQL doesn't support easy enum modification, so we'll handle this in schema.ts
-- and use a separate migration if needed
