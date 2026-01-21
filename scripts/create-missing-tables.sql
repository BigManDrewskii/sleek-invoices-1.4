-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  rate DECIMAL(24,8) NOT NULL,
  unit VARCHAR(50) DEFAULT 'unit',
  category VARCHAR(100),
  sku VARCHAR(100),
  taxable BOOLEAN DEFAULT TRUE NOT NULL,
  isActive BOOLEAN DEFAULT TRUE NOT NULL,
  usageCount INT DEFAULT 0 NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  INDEX idx_userId (userId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create estimates table
CREATE TABLE IF NOT EXISTS estimates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  clientId INT NOT NULL,
  estimateNumber VARCHAR(255) NOT NULL UNIQUE,
  status ENUM('draft', 'sent', 'accepted', 'declined', 'expired') DEFAULT 'draft' NOT NULL,
  issueDate DATE NOT NULL,
  validUntil DATE NOT NULL,
  subtotal DECIMAL(24,8) NOT NULL,
  taxRate DECIMAL(5,2) DEFAULT 0,
  taxAmount DECIMAL(24,8) DEFAULT 0,
  discountType ENUM('percentage', 'fixed') DEFAULT 'percentage',
  discountValue DECIMAL(24,8) DEFAULT 0,
  discountAmount DECIMAL(24,8) DEFAULT 0,
  total DECIMAL(24,8) NOT NULL,
  notes TEXT,
  probability INT DEFAULT 50,
  invoiceId INT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (clientId) REFERENCES clients(id) ON DELETE CASCADE,
  FOREIGN KEY (invoiceId) REFERENCES invoices(id) ON DELETE SET NULL,
  INDEX idx_userId (userId),
  INDEX idx_clientId (clientId),
  INDEX idx_status (status),
  INDEX idx_estimateNumber (estimateNumber)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create estimateLineItems table
CREATE TABLE IF NOT EXISTS estimateLineItems (
  id INT AUTO_INCREMENT PRIMARY KEY,
  estimateId INT NOT NULL,
  description TEXT NOT NULL,
  quantity DECIMAL(24,8) NOT NULL,
  rate DECIMAL(24,8) NOT NULL,
  amount DECIMAL(24,8) NOT NULL,
  sortOrder INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (estimateId) REFERENCES estimates(id) ON DELETE CASCADE,
  INDEX idx_estimateId (estimateId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create clientContacts table
CREATE TABLE IF NOT EXISTS clientContacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  clientId INT NOT NULL,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  role VARCHAR(100),
  isPrimary BOOLEAN DEFAULT FALSE NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (clientId) REFERENCES clients(id) ON DELETE CASCADE,
  INDEX idx_clientId (clientId),
  INDEX idx_isPrimary (isPrimary)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SELECT 'Tables created successfully' as status;
