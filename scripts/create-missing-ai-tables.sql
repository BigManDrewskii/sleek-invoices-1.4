-- Create aiCredits table
CREATE TABLE IF NOT EXISTS aiCredits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  month VARCHAR(7) NOT NULL,
  creditsUsed INT DEFAULT 0 NOT NULL,
  creditsLimit INT DEFAULT 5 NOT NULL,
  purchasedCredits INT DEFAULT 0 NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  UNIQUE KEY ai_credits_user_month_idx (userId, month),
  INDEX idx_userId (userId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create clientTags table
CREATE TABLE IF NOT EXISTS clientTags (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  name VARCHAR(50) NOT NULL,
  color VARCHAR(7) DEFAULT '#6366f1' NOT NULL,
  description TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  UNIQUE KEY client_tag_user_idx (userId, name),
  INDEX idx_userId (userId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create clientTagAssignments table
CREATE TABLE IF NOT EXISTS clientTagAssignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  clientId INT NOT NULL,
  tagId INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (clientId) REFERENCES clients(id) ON DELETE CASCADE,
  FOREIGN KEY (tagId) REFERENCES clientTags(id) ON DELETE CASCADE,
  UNIQUE KEY client_tag_assignment (clientId, tagId),
  INDEX idx_clientId (clientId),
  INDEX idx_tagId (tagId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SELECT 'Tables created successfully' as status;
