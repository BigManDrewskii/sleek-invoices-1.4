-- Add templateId column to invoices table
-- This allows each invoice to reference the template used for its design

ALTER TABLE `invoices` ADD COLUMN `templateId` INT NULL;
