-- Create audit log table for tracking all user actions
CREATE TABLE IF NOT EXISTS `auditLog` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `userId` int NOT NULL,
  `action` varchar(50) NOT NULL,
  `entityType` varchar(50) NOT NULL,
  `entityId` int,
  `entityName` varchar(255),
  `details` text,
  `ipAddress` varchar(45),
  `userAgent` varchar(500),
  `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_audit_user` (`userId`),
  INDEX `idx_audit_entity` (`entityType`, `entityId`),
  INDEX `idx_audit_created` (`createdAt`),
  INDEX `idx_audit_action` (`action`)
);
