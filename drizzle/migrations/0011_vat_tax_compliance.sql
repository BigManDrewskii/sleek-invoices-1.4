-- Phase 1.3: VAT/Tax Compliance
-- Adds VAT number and tax exempt fields to clients table

-- 1.3.1 Add vatNumber column to clients table (VARCHAR 50, nullable)
ALTER TABLE `clients`
  ADD COLUMN `vatNumber` VARCHAR(50) NULL;

-- 1.3.2 Add taxExempt column to clients table (BOOLEAN, default false)
ALTER TABLE `clients`
  ADD COLUMN `taxExempt` BOOLEAN NOT NULL DEFAULT FALSE;
