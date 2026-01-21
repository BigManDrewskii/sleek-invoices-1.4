-- Add missing columns to expenses table
ALTER TABLE expenses
ADD COLUMN notes TEXT NULL AFTER description,
ADD COLUMN invoiceId INT NULL AFTER clientId,
ADD COLUMN billedAt TIMESTAMP NULL AFTER invoiceId,
ADD COLUMN isTaxDeductible BOOLEAN DEFAULT TRUE NOT NULL AFTER isRecurring,
ADD FOREIGN KEY (invoiceId) REFERENCES invoices(id) ON DELETE SET NULL;

SELECT 'Columns added successfully' as status;
