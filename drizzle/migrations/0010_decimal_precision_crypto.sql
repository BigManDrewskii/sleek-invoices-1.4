-- Phase 1.2: High-Decimal Precision for Crypto Support
-- Updates all monetary columns to DECIMAL(24,8) for cryptocurrency amounts
-- Adds crypto-specific columns to invoices table

-- 1.2.1 Update invoices table monetary columns to DECIMAL(24,8)
ALTER TABLE `invoices` 
  MODIFY COLUMN `subtotal` DECIMAL(24,8) NOT NULL,
  MODIFY COLUMN `taxAmount` DECIMAL(24,8) NOT NULL DEFAULT '0.00000000',
  MODIFY COLUMN `discountValue` DECIMAL(24,8) NOT NULL DEFAULT '0.00000000',
  MODIFY COLUMN `discountAmount` DECIMAL(24,8) NOT NULL DEFAULT '0.00000000',
  MODIFY COLUMN `total` DECIMAL(24,8) NOT NULL,
  MODIFY COLUMN `amountPaid` DECIMAL(24,8) NOT NULL DEFAULT '0.00000000';

-- 1.2.2 Update invoiceLineItems table monetary columns to DECIMAL(24,8)
ALTER TABLE `invoiceLineItems`
  MODIFY COLUMN `quantity` DECIMAL(24,8) NOT NULL,
  MODIFY COLUMN `rate` DECIMAL(24,8) NOT NULL,
  MODIFY COLUMN `amount` DECIMAL(24,8) NOT NULL;

-- 1.2.3 Update expenses table monetary columns to DECIMAL(24,8)
ALTER TABLE `expenses`
  MODIFY COLUMN `amount` DECIMAL(24,8) NOT NULL,
  MODIFY COLUMN `taxAmount` DECIMAL(24,8) NOT NULL DEFAULT '0.00000000';

-- 1.2.4 Update recurringInvoices table monetary columns to DECIMAL(24,8)
ALTER TABLE `recurringInvoices`
  MODIFY COLUMN `discountValue` DECIMAL(24,8) NOT NULL DEFAULT '0.00000000';

-- 1.2.5 Update recurringInvoiceLineItems table monetary columns to DECIMAL(24,8)
ALTER TABLE `recurringInvoiceLineItems`
  MODIFY COLUMN `quantity` DECIMAL(24,8) NOT NULL,
  MODIFY COLUMN `rate` DECIMAL(24,8) NOT NULL;

-- 1.2.6 Add cryptoAmount column to invoices table (DECIMAL 24,18 for wei-level precision)
ALTER TABLE `invoices`
  ADD COLUMN `cryptoAmount` DECIMAL(24,18) NULL;

-- 1.2.7 Add cryptoCurrency column to invoices table (VARCHAR 10, nullable)
ALTER TABLE `invoices`
  ADD COLUMN `cryptoCurrency` VARCHAR(10) NULL;

-- 1.2.8 Update payments table monetary column to DECIMAL(24,8)
ALTER TABLE `payments`
  MODIFY COLUMN `amount` DECIMAL(24,8) NOT NULL;
