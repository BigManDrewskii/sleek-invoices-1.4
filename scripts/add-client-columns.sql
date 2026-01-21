-- Add missing columns to clients table
ALTER TABLE clients
ADD COLUMN vatNumber VARCHAR(50) NULL AFTER notes,
ADD COLUMN taxExempt BOOLEAN DEFAULT FALSE NOT NULL AFTER vatNumber;

SELECT 'Columns added successfully' as status;
