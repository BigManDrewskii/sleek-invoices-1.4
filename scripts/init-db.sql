-- SleekInvoices Local Development Database Initialization
-- This script runs automatically when the MySQL container starts for the first time

-- Grant all privileges to the sleekinvoices user
GRANT ALL PRIVILEGES ON sleekinvoices_dev.* TO 'sleekinvoices'@'%';
FLUSH PRIVILEGES;

-- Set timezone to UTC for consistency
SET GLOBAL time_zone = '+00:00';

-- Enable full UTF-8 support
ALTER DATABASE sleekinvoices_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

SELECT 'Database initialized successfully for SleekInvoices local development!' AS message;
