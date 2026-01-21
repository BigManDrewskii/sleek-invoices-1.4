-- Enhanced Invoice Templates Schema Migration
-- Adds comprehensive customization fields for invoice templates

-- Step 1: Add new columns to invoiceTemplates table
ALTER TABLE `invoiceTemplates` 
  ADD COLUMN `templateType` enum('modern','classic','minimal','bold','professional','creative') NOT NULL DEFAULT 'modern',
  ADD COLUMN `headingFont` varchar(50) NOT NULL DEFAULT 'Inter',
  ADD COLUMN `bodyFont` varchar(50) NOT NULL DEFAULT 'Inter',
  ADD COLUMN `logoUrl` text,
  ADD COLUMN `logoWidth` int NOT NULL DEFAULT 150,
  ADD COLUMN `headerLayout` enum('standard','centered','split') NOT NULL DEFAULT 'standard',
  ADD COLUMN `footerLayout` enum('simple','detailed','minimal') NOT NULL DEFAULT 'simple',
  ADD COLUMN `showTaxField` boolean NOT NULL DEFAULT true,
  ADD COLUMN `showDiscountField` boolean NOT NULL DEFAULT true,
  ADD COLUMN `showNotesField` boolean NOT NULL DEFAULT true,
  ADD COLUMN `language` varchar(10) NOT NULL DEFAULT 'en',
  ADD COLUMN `dateFormat` varchar(20) NOT NULL DEFAULT 'MM/DD/YYYY';

-- Step 2: Drop old fontFamily column (replaced by headingFont and bodyFont)
ALTER TABLE `invoiceTemplates` DROP COLUMN `fontFamily`;

-- Step 3: Update default colors to match SleekInvoices theme
ALTER TABLE `invoiceTemplates` 
  MODIFY COLUMN `primaryColor` varchar(7) NOT NULL DEFAULT '#5f6fff',
  MODIFY COLUMN `secondaryColor` varchar(7) NOT NULL DEFAULT '#252f33';

-- Step 4: Create customFields table for user-defined invoice fields
CREATE TABLE IF NOT EXISTS `customFields` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `userId` int NOT NULL,
  `templateId` int,
  `fieldName` varchar(100) NOT NULL,
  `fieldLabel` varchar(100) NOT NULL,
  `fieldType` enum('text','number','date','select') NOT NULL DEFAULT 'text',
  `isRequired` boolean NOT NULL DEFAULT false,
  `defaultValue` text,
  `selectOptions` text,
  `sortOrder` int NOT NULL DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_userId` (`userId`),
  INDEX `idx_templateId` (`templateId`)
);

-- Step 5: Create invoiceCustomFieldValues table to store custom field data per invoice
CREATE TABLE IF NOT EXISTS `invoiceCustomFieldValues` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `invoiceId` int NOT NULL,
  `customFieldId` int NOT NULL,
  `value` text NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_invoiceId` (`invoiceId`),
  INDEX `idx_customFieldId` (`customFieldId`),
  UNIQUE KEY `unique_invoice_field` (`invoiceId`, `customFieldId`)
);
