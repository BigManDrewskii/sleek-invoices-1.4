-- MySQL dump 10.13  Distrib 9.5.0, for macos15.7 (arm64)
--
-- Host: localhost    Database: sleekinvoices_dev
-- ------------------------------------------------------
-- Server version	9.5.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- GTID state at the beginning of the backup 
--


--
-- Table structure for table `__drizzle_migrations`
--

DROP TABLE IF EXISTS `__drizzle_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `__drizzle_migrations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `hash` text NOT NULL,
  `created_at` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `__drizzle_migrations`
--

LOCK TABLES `__drizzle_migrations` WRITE;
/*!40000 ALTER TABLE `__drizzle_migrations` DISABLE KEYS */;
INSERT INTO `__drizzle_migrations` VALUES (1,'814a08e40d7fc2bcfd458759d18319198ca8ae394f2fa15617a78678e9c9c93b',1767513747229),(2,'c873ce356661cc7e3e1c85591b309f15145931d3a61d900735985561c228b559',1767513883366),(3,'b90bf6ba24eb20a122f412f8e5be4551fea36c53d19a907da822608b1579aa65',1767517859152),(4,'a772a56ad860fd12a037ff892fc8c4e515391e2d60e087b0ed7b6cc82b9ffeec',1767526073929),(5,'05be1b791d610ee90d02dd01380733e705b34a68d66ab14a5702f083745497de',1767527158852),(6,'48f8ec467d938754bd21867e8c40c8e7de17634edba26d5ae2cba2e5d3a92b4c',1767532096001),(7,'08ddcdd295f6b0957461bac82f0d7911c128d264c7c405503563bc57e0221e59',1767533152001),(8,'09eb513facb1356098c06327df6ed91dd7e7a407ad143af4136e1c63162df1be',1767534764508),(9,'fac2bc3dd2ed9782f9d61b5e7ebd902bae16a15fdfb8017ce0e6bb814f7b9401',1767540644159);
/*!40000 ALTER TABLE `__drizzle_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aiCreditPurchases`
--

DROP TABLE IF EXISTS `aiCreditPurchases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aiCreditPurchases` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `stripeSessionId` varchar(255) NOT NULL,
  `stripePaymentIntentId` varchar(255) DEFAULT NULL,
  `packType` enum('starter','standard','pro_pack') NOT NULL,
  `creditsAmount` int NOT NULL,
  `amountPaid` int NOT NULL,
  `currency` varchar(3) NOT NULL DEFAULT 'usd',
  `status` enum('pending','completed','failed','refunded') NOT NULL DEFAULT 'pending',
  `appliedToMonth` varchar(7) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `completedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `stripeSessionId` (`stripeSessionId`),
  KEY `idx_userId` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aiCreditPurchases`
--

LOCK TABLES `aiCreditPurchases` WRITE;
/*!40000 ALTER TABLE `aiCreditPurchases` DISABLE KEYS */;
/*!40000 ALTER TABLE `aiCreditPurchases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aiCredits`
--

DROP TABLE IF EXISTS `aiCredits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aiCredits` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `month` varchar(7) NOT NULL,
  `creditsUsed` int NOT NULL DEFAULT '0',
  `creditsLimit` int NOT NULL DEFAULT '50',
  `purchasedCredits` int NOT NULL DEFAULT '0',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_month_idx` (`userId`,`month`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aiCredits`
--

LOCK TABLES `aiCredits` WRITE;
/*!40000 ALTER TABLE `aiCredits` DISABLE KEYS */;
INSERT INTO `aiCredits` VALUES (4,1,'2025-11',12,50,9,'2026-01-15 08:50:53','2026-01-15 08:52:05'),(5,1,'2025-12',18,50,6,'2026-01-15 08:50:53','2026-01-15 08:52:05'),(6,1,'2026-01',5,50,1,'2026-01-15 08:50:53','2026-01-15 08:52:05'),(7,1,'2026-02',9,50,6,'2026-01-15 08:50:53','2026-01-15 08:52:05');
/*!40000 ALTER TABLE `aiCredits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aiUsageLogs`
--

DROP TABLE IF EXISTS `aiUsageLogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aiUsageLogs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `feature` enum('smart_compose','categorization','prediction','ai_assistant') NOT NULL,
  `inputTokens` int NOT NULL DEFAULT '0',
  `outputTokens` int NOT NULL DEFAULT '0',
  `model` varchar(100) NOT NULL,
  `success` tinyint(1) NOT NULL DEFAULT '1',
  `errorMessage` text,
  `latencyMs` int DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_userId` (`userId`),
  KEY `idx_feature` (`feature`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aiUsageLogs`
--

LOCK TABLES `aiUsageLogs` WRITE;
/*!40000 ALTER TABLE `aiUsageLogs` DISABLE KEYS */;
INSERT INTO `aiUsageLogs` VALUES (16,1,'smart_compose',161,425,'gpt-4',1,NULL,246,'2026-01-15 08:52:05'),(17,1,'categorization',434,542,'gpt-4',1,NULL,455,'2026-01-15 08:52:05'),(18,1,'prediction',164,585,'gpt-4',1,NULL,393,'2026-01-15 08:52:05'),(19,1,'ai_assistant',526,270,'gpt-4',1,NULL,597,'2026-01-15 08:52:05'),(20,1,'smart_compose',149,847,'gpt-4',1,NULL,567,'2026-01-15 08:52:05'),(21,1,'smart_compose',477,462,'gpt-4',1,NULL,453,'2026-01-15 08:52:05'),(22,1,'prediction',569,810,'gpt-4',1,NULL,574,'2026-01-15 08:52:05'),(23,1,'smart_compose',329,476,'gpt-4',1,NULL,292,'2026-01-15 08:52:05'),(24,1,'ai_assistant',350,333,'gpt-4',1,NULL,531,'2026-01-15 08:52:05'),(25,1,'ai_assistant',307,1169,'gpt-4',1,NULL,578,'2026-01-15 08:52:05'),(26,1,'smart_compose',471,318,'gpt-4',1,NULL,590,'2026-01-15 08:52:05'),(27,1,'prediction',344,555,'gpt-4',1,NULL,542,'2026-01-15 08:52:05'),(28,1,'prediction',287,605,'gpt-4',1,NULL,382,'2026-01-15 08:52:05'),(29,1,'smart_compose',555,1005,'gpt-4',1,NULL,117,'2026-01-15 08:52:05'),(30,1,'categorization',202,1077,'gpt-4',1,NULL,422,'2026-01-15 08:52:05');
/*!40000 ALTER TABLE `aiUsageLogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auditLog`
--

DROP TABLE IF EXISTS `auditLog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auditLog` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `action` varchar(50) NOT NULL,
  `entityType` varchar(50) NOT NULL,
  `entityId` int DEFAULT NULL,
  `entityName` varchar(255) DEFAULT NULL,
  `details` text,
  `ipAddress` varchar(45) DEFAULT NULL,
  `userAgent` varchar(500) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_userId` (`userId`),
  KEY `idx_entity` (`entityType`,`entityId`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auditLog`
--

LOCK TABLES `auditLog` WRITE;
/*!40000 ALTER TABLE `auditLog` DISABLE KEYS */;
INSERT INTO `auditLog` VALUES (1,1,'send','client',1,'client_1',NULL,'192.168.1.100','Mozilla/5.0','2026-01-15 08:52:05'),(2,1,'update','estimate',3,'estimate_2',NULL,'192.168.1.100','Mozilla/5.0','2026-01-15 08:52:05'),(3,1,'payment','client',7,'client_3',NULL,'192.168.1.100','Mozilla/5.0','2026-01-15 08:52:05'),(4,1,'payment','client',8,'client_4',NULL,'192.168.1.100','Mozilla/5.0','2026-01-15 08:52:05'),(5,1,'view','payment',3,'payment_5',NULL,'192.168.1.100','Mozilla/5.0','2026-01-15 08:52:05'),(6,1,'send','payment',2,'payment_6',NULL,'192.168.1.100','Mozilla/5.0','2026-01-15 08:52:05'),(7,1,'payment','estimate',4,'estimate_7',NULL,'192.168.1.100','Mozilla/5.0','2026-01-15 08:52:05'),(8,1,'create','client',5,'client_8',NULL,'192.168.1.100','Mozilla/5.0','2026-01-15 08:52:05'),(9,1,'update','client',7,'client_9',NULL,'192.168.1.100','Mozilla/5.0','2026-01-15 08:52:05'),(10,1,'update','client',7,'client_10',NULL,'192.168.1.100','Mozilla/5.0','2026-01-15 08:52:05'),(11,1,'send','estimate',1,'estimate_11',NULL,'192.168.1.100','Mozilla/5.0','2026-01-15 08:52:05'),(12,1,'view','client',6,'client_12',NULL,'192.168.1.100','Mozilla/5.0','2026-01-15 08:52:05'),(13,1,'update','client',10,'client_13',NULL,'192.168.1.100','Mozilla/5.0','2026-01-15 08:52:05'),(14,1,'update','estimate',5,'estimate_14',NULL,'192.168.1.100','Mozilla/5.0','2026-01-15 08:52:05'),(15,1,'create','invoice',5,'invoice_15',NULL,'192.168.1.100','Mozilla/5.0','2026-01-15 08:52:05'),(16,1,'send','estimate',7,'estimate_16',NULL,'192.168.1.100','Mozilla/5.0','2026-01-15 08:52:05'),(17,1,'view','estimate',4,'estimate_17',NULL,'192.168.1.100','Mozilla/5.0','2026-01-15 08:52:05'),(18,1,'update','invoice',8,'invoice_18',NULL,'192.168.1.100','Mozilla/5.0','2026-01-15 08:52:05'),(19,1,'send','invoice',2,'invoice_19',NULL,'192.168.1.100','Mozilla/5.0','2026-01-15 08:52:05'),(20,1,'payment','client',7,'client_20',NULL,'192.168.1.100','Mozilla/5.0','2026-01-15 08:52:05');
/*!40000 ALTER TABLE `auditLog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `batchInvoiceTemplateLineItems`
--

DROP TABLE IF EXISTS `batchInvoiceTemplateLineItems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `batchInvoiceTemplateLineItems` (
  `id` int NOT NULL AUTO_INCREMENT,
  `templateId` int NOT NULL,
  `description` text NOT NULL,
  `quantity` decimal(24,8) NOT NULL,
  `rate` decimal(24,8) NOT NULL,
  `sortOrder` int NOT NULL DEFAULT '0',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_templateId` (`templateId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `batchInvoiceTemplateLineItems`
--

LOCK TABLES `batchInvoiceTemplateLineItems` WRITE;
/*!40000 ALTER TABLE `batchInvoiceTemplateLineItems` DISABLE KEYS */;
/*!40000 ALTER TABLE `batchInvoiceTemplateLineItems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `batchInvoiceTemplates`
--

DROP TABLE IF EXISTS `batchInvoiceTemplates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `batchInvoiceTemplates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  `dueInDays` int NOT NULL DEFAULT '30',
  `currency` varchar(10) NOT NULL DEFAULT 'USD',
  `taxRate` decimal(5,2) NOT NULL DEFAULT '0.00',
  `invoiceTemplateId` int DEFAULT NULL,
  `notes` text,
  `paymentTerms` text,
  `frequency` enum('one-time','weekly','monthly','quarterly','yearly') NOT NULL DEFAULT 'monthly',
  `usageCount` int NOT NULL DEFAULT '0',
  `lastUsedAt` timestamp NULL DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_userId` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `batchInvoiceTemplates`
--

LOCK TABLES `batchInvoiceTemplates` WRITE;
/*!40000 ALTER TABLE `batchInvoiceTemplates` DISABLE KEYS */;
INSERT INTO `batchInvoiceTemplates` VALUES (1,1,'Monthly Retainer Package','Standard monthly retainer for all clients',30,'USD',8.50,NULL,NULL,NULL,'monthly',5,NULL,'2026-01-15 08:52:05','2026-01-15 08:52:05');
/*!40000 ALTER TABLE `batchInvoiceTemplates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clientContacts`
--

DROP TABLE IF EXISTS `clientContacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clientContacts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `clientId` int NOT NULL,
  `firstName` varchar(100) DEFAULT NULL,
  `lastName` varchar(100) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `role` varchar(100) DEFAULT NULL,
  `isPrimary` tinyint(1) DEFAULT '0',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_clientId` (`clientId`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientContacts`
--

LOCK TABLES `clientContacts` WRITE;
/*!40000 ALTER TABLE `clientContacts` DISABLE KEYS */;
INSERT INTO `clientContacts` VALUES (1,105,'John','Smith','john.smith@acme.com',NULL,'Finance Manager',1,'2026-01-15 08:50:18','2026-01-15 08:50:18'),(2,106,'Sarah','Johnson','sarah.j@techstart.io',NULL,'CEO',1,'2026-01-15 08:50:18','2026-01-15 08:50:18'),(3,107,'Michael','Chen','mchen@globalventures.com',NULL,'Controller',1,'2026-01-15 08:50:18','2026-01-15 08:50:18'),(4,108,'Emily','Davis','emily@creativeagency.co',NULL,'Creative Director',1,'2026-01-15 08:50:18','2026-01-15 08:50:18'),(5,113,'John','Smith','john.smith@acme.com',NULL,'Finance Manager',1,'2026-01-15 08:50:38','2026-01-15 08:50:38'),(6,114,'Sarah','Johnson','sarah.j@techstart.io',NULL,'CEO',1,'2026-01-15 08:50:38','2026-01-15 08:50:38'),(7,115,'Michael','Chen','mchen@globalventures.com',NULL,'Controller',1,'2026-01-15 08:50:38','2026-01-15 08:50:38'),(8,116,'Emily','Davis','emily@creativeagency.co',NULL,'Creative Director',1,'2026-01-15 08:50:38','2026-01-15 08:50:38'),(9,121,'John','Smith','john.smith@acme.com',NULL,'Finance Manager',1,'2026-01-15 08:50:52','2026-01-15 08:50:52'),(10,122,'Sarah','Johnson','sarah.j@techstart.io',NULL,'CEO',1,'2026-01-15 08:50:52','2026-01-15 08:50:52'),(11,123,'Michael','Chen','mchen@globalventures.com',NULL,'Controller',1,'2026-01-15 08:50:52','2026-01-15 08:50:52'),(12,124,'Emily','Davis','emily@creativeagency.co',NULL,'Creative Director',1,'2026-01-15 08:50:52','2026-01-15 08:50:52'),(13,129,'John','Smith','john.smith@acme.com',NULL,'Finance Manager',1,'2026-01-15 08:51:08','2026-01-15 08:51:08'),(14,130,'Sarah','Johnson','sarah.j@techstart.io',NULL,'CEO',1,'2026-01-15 08:51:08','2026-01-15 08:51:08'),(15,131,'Michael','Chen','mchen@globalventures.com',NULL,'Controller',1,'2026-01-15 08:51:08','2026-01-15 08:51:08'),(16,132,'Emily','Davis','emily@creativeagency.co',NULL,'Creative Director',1,'2026-01-15 08:51:08','2026-01-15 08:51:08'),(17,137,'John','Smith','john.smith@acme.com',NULL,'Finance Manager',1,'2026-01-15 08:52:05','2026-01-15 08:52:05'),(18,138,'Sarah','Johnson','sarah.j@techstart.io',NULL,'CEO',1,'2026-01-15 08:52:05','2026-01-15 08:52:05'),(19,139,'Michael','Chen','mchen@globalventures.com',NULL,'Controller',1,'2026-01-15 08:52:05','2026-01-15 08:52:05'),(20,140,'Emily','Davis','emily@creativeagency.co',NULL,'Creative Director',1,'2026-01-15 08:52:05','2026-01-15 08:52:05');
/*!40000 ALTER TABLE `clientContacts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clientPortalAccess`
--

DROP TABLE IF EXISTS `clientPortalAccess`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clientPortalAccess` (
  `id` int NOT NULL AUTO_INCREMENT,
  `clientId` int NOT NULL,
  `accessToken` varchar(255) NOT NULL,
  `expiresAt` timestamp NOT NULL,
  `lastAccessedAt` timestamp NULL DEFAULT NULL,
  `isActive` int NOT NULL DEFAULT '1',
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  UNIQUE KEY `clientPortalAccess_accessToken_unique` (`accessToken`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientPortalAccess`
--

LOCK TABLES `clientPortalAccess` WRITE;
/*!40000 ALTER TABLE `clientPortalAccess` DISABLE KEYS */;
INSERT INTO `clientPortalAccess` VALUES (46,137,'MTM3LTE3Njg0NjcxMjU1NTYtM2l2bGQxbHQwOGc','2027-01-15 06:52:05',NULL,1,'2026-01-15 08:52:05'),(47,138,'MTM4LTE3Njg0NjcxMjU1NTYtYzVjaWdlcTNoNWg','2027-01-15 06:52:05',NULL,1,'2026-01-15 08:52:05'),(48,139,'MTM5LTE3Njg0NjcxMjU1NTYtemFyc2gwN2xjcm8','2027-01-15 06:52:05',NULL,1,'2026-01-15 08:52:05'),(49,140,'MTQwLTE3Njg0NjcxMjU1NTYtdGVkNTVqcWNxNQ','2027-01-15 06:52:05',NULL,1,'2026-01-15 08:52:05'),(50,141,'MTQxLTE3Njg0NjcxMjU1NTctemJlNGxkbGwydms','2027-01-15 06:52:05',NULL,1,'2026-01-15 08:52:05');
/*!40000 ALTER TABLE `clientPortalAccess` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `name` text NOT NULL,
  `email` varchar(320) DEFAULT NULL,
  `companyName` text,
  `address` text,
  `phone` varchar(50) DEFAULT NULL,
  `notes` text,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  `vatNumber` varchar(50) DEFAULT NULL,
  `taxExempt` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=145 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
INSERT INTO `clients` VALUES (137,1,'Acme Corporation','billing@acme.com','Acme Corp','123 Industrial Way, San Francisco, CA 94102','+1 (415) 555-0100',NULL,'2026-01-15 08:52:05','2026-01-15 08:52:05','US123456789',0),(138,1,'TechStart Inc','accounts@techstart.io','TechStart','456 Innovation Blvd, Austin, TX 78701','+1 (512) 555-0200',NULL,'2026-01-15 08:52:05','2026-01-15 08:52:05','US987654321',0),(139,1,'Global Ventures','finance@globalventures.com','Global Ventures LLC','789 Commerce St, New York, NY 10001','+1 (212) 555-0300',NULL,'2026-01-15 08:52:05','2026-01-15 08:52:05','US456789123',0),(140,1,'Creative Agency','hello@creativeagency.co','Creative Agency Inc','321 Design Ave, Los Angeles, CA 90001','+1 (310) 555-0400',NULL,'2026-01-15 08:52:05','2026-01-15 08:52:05','US321654987',0),(141,1,'DataFlow Systems','ap@dataflow.systems','DataFlow Systems Corp','555 Server Lane, Seattle, WA 98101','+1 (206) 555-0500',NULL,'2026-01-15 08:52:05','2026-01-15 08:52:05','US654321789',0),(142,1,'Summit Partners','payments@summitpartners.net','Summit Partners LLC','999 Mountain View, Denver, CO 80202','+1 (303) 555-0600',NULL,'2026-01-15 08:52:05','2026-01-15 08:52:05','US789123456',0),(143,1,'Oceanic Trading Co','finance@oceanictrading.com','Oceanic Trading Company','888 Harbor Dr, Miami, FL 33101','+1 (305) 555-0700',NULL,'2026-01-15 08:52:05','2026-01-15 08:52:05','US147258369',0),(144,1,'Pinnacle Consulting','billing@pinnacleconsult.net','Pinnacle Consulting Group','777 Executive Plaza, Chicago, IL 60601','+1 (312) 555-0800',NULL,'2026-01-15 08:52:05','2026-01-15 08:52:05','US258369147',0);
/*!40000 ALTER TABLE `clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clientTagAssignments`
--

DROP TABLE IF EXISTS `clientTagAssignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clientTagAssignments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `clientId` int NOT NULL,
  `tagId` int NOT NULL,
  `assignedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `client_tag_assignment_idx` (`clientId`,`tagId`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientTagAssignments`
--

LOCK TABLES `clientTagAssignments` WRITE;
/*!40000 ALTER TABLE `clientTagAssignments` DISABLE KEYS */;
INSERT INTO `clientTagAssignments` VALUES (7,137,11,'2026-01-15 08:52:05'),(8,138,12,'2026-01-15 08:52:05'),(10,139,12,'2026-01-15 09:04:42');
/*!40000 ALTER TABLE `clientTagAssignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clientTags`
--

DROP TABLE IF EXISTS `clientTags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clientTags` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `name` varchar(50) NOT NULL,
  `color` varchar(7) NOT NULL DEFAULT '#6366f1',
  `description` text,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `client_tag_user_idx` (`userId`,`name`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientTags`
--

LOCK TABLES `clientTags` WRITE;
/*!40000 ALTER TABLE `clientTags` DISABLE KEYS */;
INSERT INTO `clientTags` VALUES (11,1,'VIP','#f59e0b','High-value clients','2026-01-15 08:52:05','2026-01-15 08:52:05'),(12,1,'Recurring','#10b981','Recurring business','2026-01-15 08:52:05','2026-01-15 08:52:05'),(13,1,'Enterprise','#6366f1','Enterprise accounts','2026-01-15 08:52:05','2026-01-15 08:52:05'),(14,1,'New','#3b82f6','New clients','2026-01-15 08:52:05','2026-01-15 08:52:05');
/*!40000 ALTER TABLE `clientTags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cryptoSubscriptionPayments`
--

DROP TABLE IF EXISTS `cryptoSubscriptionPayments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cryptoSubscriptionPayments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `paymentId` varchar(255) NOT NULL,
  `paymentStatus` varchar(50) NOT NULL,
  `priceAmount` decimal(24,8) NOT NULL,
  `priceCurrency` varchar(10) NOT NULL,
  `payCurrency` varchar(10) NOT NULL,
  `payAmount` decimal(24,8) NOT NULL,
  `months` int NOT NULL DEFAULT '1',
  `isExtension` tinyint(1) NOT NULL DEFAULT '0',
  `confirmedAt` timestamp NULL DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `paymentId` (`paymentId`),
  KEY `idx_userId` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cryptoSubscriptionPayments`
--

LOCK TABLES `cryptoSubscriptionPayments` WRITE;
/*!40000 ALTER TABLE `cryptoSubscriptionPayments` DISABLE KEYS */;
/*!40000 ALTER TABLE `cryptoSubscriptionPayments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `currencies`
--

DROP TABLE IF EXISTS `currencies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `currencies` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(3) NOT NULL,
  `name` varchar(100) NOT NULL,
  `symbol` varchar(10) NOT NULL,
  `exchangeRateToUSD` varchar(20) NOT NULL,
  `lastUpdated` timestamp NOT NULL DEFAULT (now()),
  `isActive` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `currencies_code_unique` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `currencies`
--

LOCK TABLES `currencies` WRITE;
/*!40000 ALTER TABLE `currencies` DISABLE KEYS */;
INSERT INTO `currencies` VALUES (1,'USD','US Dollar','$','1','2026-01-15 08:03:49',1),(2,'EUR','Euro','€','0.859','2026-01-15 08:03:49',1),(3,'GBP','British Pound','£','0.744','2026-01-15 08:03:49',1),(4,'JPY','Japanese Yen','¥','158.5','2026-01-15 08:03:49',1),(5,'CAD','Canadian Dollar','C$','1.39','2026-01-15 08:03:49',1),(6,'AUD','Australian Dollar','A$','1.5','2026-01-15 08:03:49',1),(7,'CHF','Swiss Franc','CHF','0.8','2026-01-15 08:03:49',1),(8,'CNY','Chinese Yuan','¥','6.99','2026-01-15 08:03:49',1),(9,'INR','Indian Rupee','₹','90.34','2026-01-15 08:03:49',1);
/*!40000 ALTER TABLE `currencies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customFields`
--

DROP TABLE IF EXISTS `customFields`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customFields` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `templateId` int DEFAULT NULL,
  `fieldName` varchar(100) NOT NULL,
  `fieldLabel` varchar(100) NOT NULL,
  `fieldType` enum('text','number','date','select') NOT NULL DEFAULT 'text',
  `isRequired` tinyint(1) NOT NULL DEFAULT '0',
  `defaultValue` text,
  `selectOptions` text,
  `sortOrder` int NOT NULL DEFAULT '0',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_userId` (`userId`),
  KEY `idx_templateId` (`templateId`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customFields`
--

LOCK TABLES `customFields` WRITE;
/*!40000 ALTER TABLE `customFields` DISABLE KEYS */;
INSERT INTO `customFields` VALUES (1,1,NULL,'po_number','PO Number','text',0,NULL,NULL,0,'2026-01-15 08:50:53','2026-01-15 08:50:53'),(2,1,NULL,'project_code','Project Code','text',0,NULL,NULL,0,'2026-01-15 08:50:53','2026-01-15 08:50:53'),(3,1,NULL,'delivery_date','Delivery Date','date',0,NULL,NULL,0,'2026-01-15 08:50:53','2026-01-15 08:50:53'),(4,1,NULL,'po_number','PO Number','text',0,NULL,NULL,0,'2026-01-15 08:52:05','2026-01-15 08:52:05'),(5,1,NULL,'project_code','Project Code','text',0,NULL,NULL,0,'2026-01-15 08:52:05','2026-01-15 08:52:05'),(6,1,NULL,'delivery_date','Delivery Date','date',0,NULL,NULL,0,'2026-01-15 08:52:05','2026-01-15 08:52:05');
/*!40000 ALTER TABLE `customFields` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `emailLog`
--

DROP TABLE IF EXISTS `emailLog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `emailLog` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `invoiceId` int NOT NULL,
  `recipientEmail` varchar(320) NOT NULL,
  `subject` text NOT NULL,
  `emailType` enum('invoice','reminder','receipt') NOT NULL,
  `sentAt` timestamp NOT NULL DEFAULT (now()),
  `success` tinyint(1) NOT NULL DEFAULT '1',
  `errorMessage` text,
  `messageId` varchar(255) DEFAULT NULL,
  `deliveryStatus` enum('sent','delivered','opened','clicked','bounced','complained','failed') DEFAULT NULL,
  `deliveredAt` timestamp NULL DEFAULT NULL,
  `openedAt` timestamp NULL DEFAULT NULL,
  `openCount` int NOT NULL DEFAULT '0',
  `clickedAt` timestamp NULL DEFAULT NULL,
  `clickCount` int NOT NULL DEFAULT '0',
  `bouncedAt` timestamp NULL DEFAULT NULL,
  `bounceType` varchar(50) DEFAULT NULL,
  `retryCount` int NOT NULL DEFAULT '0',
  `lastRetryAt` timestamp NULL DEFAULT NULL,
  `nextRetryAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_email_user_sent` (`userId`,`sentAt`)
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emailLog`
--

LOCK TABLES `emailLog` WRITE;
/*!40000 ALTER TABLE `emailLog` DISABLE KEYS */;
INSERT INTO `emailLog` VALUES (65,1,109,'client@example.com','Invoice notification - 1','invoice','2026-01-09 06:52:05',1,NULL,NULL,NULL,NULL,NULL,0,NULL,0,NULL,NULL,0,NULL,NULL),(66,1,105,'client@example.com','Invoice notification - 2','reminder','2025-12-17 06:52:05',1,NULL,NULL,NULL,NULL,NULL,0,NULL,0,NULL,NULL,0,NULL,NULL),(67,1,108,'client@example.com','Invoice notification - 3','invoice','2025-12-19 06:52:05',1,NULL,NULL,NULL,NULL,NULL,0,NULL,0,NULL,NULL,0,NULL,NULL),(68,1,111,'client@example.com','Invoice notification - 4','reminder','2025-12-25 06:52:05',1,NULL,NULL,NULL,NULL,NULL,0,NULL,0,NULL,NULL,0,NULL,NULL),(69,1,105,'client@example.com','Invoice notification - 5','receipt','2026-01-04 06:52:05',1,NULL,NULL,NULL,NULL,NULL,0,NULL,0,NULL,NULL,0,NULL,NULL),(70,1,107,'client@example.com','Invoice notification - 6','invoice','2025-12-24 06:52:05',1,NULL,NULL,NULL,NULL,NULL,0,NULL,0,NULL,NULL,0,NULL,NULL),(71,1,107,'client@example.com','Invoice notification - 7','invoice','2026-01-13 06:52:05',1,NULL,NULL,NULL,NULL,NULL,0,NULL,0,NULL,NULL,0,NULL,NULL),(72,1,105,'client@example.com','Invoice notification - 8','reminder','2025-12-21 06:52:05',1,NULL,NULL,NULL,NULL,NULL,0,NULL,0,NULL,NULL,0,NULL,NULL);
/*!40000 ALTER TABLE `emailLog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estimateLineItems`
--

DROP TABLE IF EXISTS `estimateLineItems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estimateLineItems` (
  `id` int NOT NULL AUTO_INCREMENT,
  `estimateId` int NOT NULL,
  `description` text NOT NULL,
  `quantity` decimal(24,8) NOT NULL,
  `rate` decimal(24,8) NOT NULL,
  `amount` decimal(24,8) NOT NULL,
  `sortOrder` int NOT NULL DEFAULT '0',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_estimateId` (`estimateId`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estimateLineItems`
--

LOCK TABLES `estimateLineItems` WRITE;
/*!40000 ALTER TABLE `estimateLineItems` DISABLE KEYS */;
INSERT INTO `estimateLineItems` VALUES (1,1,'Discovery and Planning Phase',10.00000000,800.00000000,8000.00000000,0,'2026-01-15 08:50:52'),(2,1,'Design and Prototyping',4.00000000,510.00000000,2040.00000000,1,'2026-01-15 08:50:52'),(3,1,'Development and Implementation',5.00000000,810.00000000,4050.00000000,2,'2026-01-15 08:50:52'),(4,1,'Testing and Quality Assurance',8.00000000,670.00000000,5360.00000000,3,'2026-01-15 08:50:52'),(5,2,'Discovery and Planning Phase',6.00000000,630.00000000,3780.00000000,0,'2026-01-15 08:50:52'),(6,2,'Design and Prototyping',10.00000000,1070.00000000,10700.00000000,1,'2026-01-15 08:50:52'),(7,2,'Development and Implementation',10.00000000,830.00000000,8300.00000000,2,'2026-01-15 08:50:52'),(8,2,'Testing and Quality Assurance',2.00000000,870.00000000,1740.00000000,3,'2026-01-15 08:50:52'),(9,3,'Discovery and Planning Phase',1.00000000,910.00000000,910.00000000,0,'2026-01-15 08:50:52'),(10,3,'Design and Prototyping',3.00000000,620.00000000,1860.00000000,1,'2026-01-15 08:50:52'),(11,3,'Development and Implementation',5.00000000,1370.00000000,6850.00000000,2,'2026-01-15 08:50:52'),(12,3,'Testing and Quality Assurance',4.00000000,1370.00000000,5480.00000000,3,'2026-01-15 08:50:52'),(13,4,'Discovery and Planning Phase',7.00000000,520.00000000,3640.00000000,0,'2026-01-15 08:50:52'),(14,4,'Design and Prototyping',3.00000000,860.00000000,2580.00000000,1,'2026-01-15 08:50:52'),(15,4,'Development and Implementation',6.00000000,1100.00000000,6600.00000000,2,'2026-01-15 08:50:52'),(16,4,'Testing and Quality Assurance',2.00000000,610.00000000,1220.00000000,3,'2026-01-15 08:50:52'),(17,5,'Discovery and Planning Phase',6.00000000,1390.00000000,8340.00000000,0,'2026-01-15 08:52:05'),(18,5,'Design and Prototyping',6.00000000,1270.00000000,7620.00000000,1,'2026-01-15 08:52:05'),(19,5,'Development and Implementation',10.00000000,650.00000000,6500.00000000,2,'2026-01-15 08:52:05'),(20,5,'Testing and Quality Assurance',4.00000000,710.00000000,2840.00000000,3,'2026-01-15 08:52:05'),(21,6,'Discovery and Planning Phase',9.00000000,1380.00000000,12420.00000000,0,'2026-01-15 08:52:05'),(22,6,'Design and Prototyping',6.00000000,690.00000000,4140.00000000,1,'2026-01-15 08:52:05'),(23,6,'Development and Implementation',5.00000000,770.00000000,3850.00000000,2,'2026-01-15 08:52:05'),(24,6,'Testing and Quality Assurance',3.00000000,640.00000000,1920.00000000,3,'2026-01-15 08:52:05'),(25,7,'Discovery and Planning Phase',9.00000000,1470.00000000,13230.00000000,0,'2026-01-15 08:52:05'),(26,7,'Design and Prototyping',6.00000000,1350.00000000,8100.00000000,1,'2026-01-15 08:52:05'),(27,7,'Development and Implementation',1.00000000,1110.00000000,1110.00000000,2,'2026-01-15 08:52:05'),(28,7,'Testing and Quality Assurance',4.00000000,660.00000000,2640.00000000,3,'2026-01-15 08:52:05'),(29,8,'Discovery and Planning Phase',3.00000000,1330.00000000,3990.00000000,0,'2026-01-15 08:52:05'),(30,8,'Design and Prototyping',10.00000000,1010.00000000,10100.00000000,1,'2026-01-15 08:52:05'),(31,8,'Development and Implementation',4.00000000,780.00000000,3120.00000000,2,'2026-01-15 08:52:05'),(32,8,'Testing and Quality Assurance',1.00000000,1070.00000000,1070.00000000,3,'2026-01-15 08:52:05');
/*!40000 ALTER TABLE `estimateLineItems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estimates`
--

DROP TABLE IF EXISTS `estimates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estimates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `clientId` int NOT NULL,
  `estimateNumber` varchar(50) NOT NULL,
  `status` enum('draft','sent','viewed','accepted','rejected','expired','converted') NOT NULL DEFAULT 'draft',
  `currency` varchar(10) NOT NULL DEFAULT 'USD',
  `subtotal` decimal(24,8) NOT NULL,
  `taxRate` decimal(5,2) NOT NULL DEFAULT '0.00',
  `taxAmount` decimal(24,8) NOT NULL DEFAULT '0.00000000',
  `discountType` enum('percentage','fixed') DEFAULT 'percentage',
  `discountValue` decimal(24,8) NOT NULL DEFAULT '0.00000000',
  `discountAmount` decimal(24,8) NOT NULL DEFAULT '0.00000000',
  `total` decimal(24,8) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `notes` text,
  `terms` text,
  `templateId` int DEFAULT NULL,
  `issueDate` timestamp NOT NULL,
  `validUntil` timestamp NOT NULL,
  `sentAt` timestamp NULL DEFAULT NULL,
  `viewedAt` timestamp NULL DEFAULT NULL,
  `acceptedAt` timestamp NULL DEFAULT NULL,
  `rejectedAt` timestamp NULL DEFAULT NULL,
  `convertedToInvoiceId` int DEFAULT NULL,
  `convertedAt` timestamp NULL DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_userId` (`userId`),
  KEY `idx_clientId` (`clientId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estimates`
--

LOCK TABLES `estimates` WRITE;
/*!40000 ALTER TABLE `estimates` DISABLE KEYS */;
INSERT INTO `estimates` VALUES (1,1,121,'EST-2026-001','accepted','USD',5000.00000000,8.50,425.00000000,'percentage',0.00000000,0.00000000,5425.00000000,'Website Redesign Project',NULL,NULL,NULL,'2026-01-10 06:50:52','2026-02-09 06:50:52',NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-15 08:50:52','2026-01-15 08:50:52'),(2,1,122,'EST-2026-002','sent','USD',3500.00000000,0.00,0.00000000,'percentage',0.00000000,0.00000000,3500.00000000,'Mobile App MVP',NULL,NULL,NULL,'2026-01-10 06:50:52','2026-02-09 06:50:52',NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-15 08:50:52','2026-01-15 08:50:52'),(3,1,123,'EST-2026-003','draft','USD',8000.00000000,10.00,800.00000000,'percentage',0.00000000,0.00000000,8800.00000000,'Enterprise Integration',NULL,NULL,NULL,'2026-01-10 06:50:52','2026-02-09 06:50:52',NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-15 08:50:52','2026-01-15 08:50:52'),(4,1,124,'EST-2026-004','viewed','USD',2200.00000000,5.00,110.00000000,'percentage',0.00000000,0.00000000,2310.00000000,'Brand Refresh',NULL,NULL,NULL,'2026-01-10 06:50:52','2026-02-09 06:50:52',NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-15 08:50:52','2026-01-15 08:50:52'),(5,1,137,'EST-2026-001','accepted','USD',5000.00000000,8.50,425.00000000,'percentage',0.00000000,0.00000000,5425.00000000,'Website Redesign Project',NULL,NULL,NULL,'2026-01-10 06:52:05','2026-02-09 06:52:05',NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-15 08:52:05','2026-01-15 08:52:05'),(6,1,138,'EST-2026-002','sent','USD',3500.00000000,0.00,0.00000000,'percentage',0.00000000,0.00000000,3500.00000000,'Mobile App MVP',NULL,NULL,NULL,'2026-01-10 06:52:05','2026-02-09 06:52:05',NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-15 08:52:05','2026-01-15 08:52:05'),(7,1,139,'EST-2026-003','draft','USD',8000.00000000,10.00,800.00000000,'percentage',0.00000000,0.00000000,8800.00000000,'Enterprise Integration',NULL,NULL,NULL,'2026-01-10 06:52:05','2026-02-09 06:52:05',NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-15 08:52:05','2026-01-15 08:52:05'),(8,1,140,'EST-2026-004','viewed','USD',2200.00000000,5.00,110.00000000,'percentage',0.00000000,0.00000000,2310.00000000,'Brand Refresh',NULL,NULL,NULL,'2026-01-10 06:52:05','2026-02-09 06:52:05',NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-15 08:52:05','2026-01-15 08:52:05');
/*!40000 ALTER TABLE `estimates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `expenseCategories`
--

DROP TABLE IF EXISTS `expenseCategories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `expenseCategories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `color` varchar(7) NOT NULL DEFAULT '#64748b',
  `icon` varchar(50) NOT NULL DEFAULT 'receipt',
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=97 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expenseCategories`
--

LOCK TABLES `expenseCategories` WRITE;
/*!40000 ALTER TABLE `expenseCategories` DISABLE KEYS */;
INSERT INTO `expenseCategories` VALUES (81,1,'Software & Subscriptions','#3b82f6','software','2026-01-15 08:50:52'),(82,1,'Office Supplies','#22c55e','office','2026-01-15 08:50:52'),(83,1,'Travel & Transportation','#f59e0b','travel','2026-01-15 08:50:52'),(84,1,'Professional Services','#8b5cf6','professional','2026-01-15 08:50:52'),(85,1,'Marketing & Advertising','#ec4899','marketing','2026-01-15 08:50:52'),(86,1,'Utilities','#06b6d4','utilities','2026-01-15 08:50:52'),(87,1,'Equipment & Hardware','#6366f1','equipment','2026-01-15 08:50:52'),(88,1,'Meals & Entertainment','#f97316','meals','2026-01-15 08:50:52'),(89,1,'Software & Subscriptions','#3b82f6','software','2026-01-15 08:52:05'),(90,1,'Office Supplies','#22c55e','office','2026-01-15 08:52:05'),(91,1,'Travel & Transportation','#f59e0b','travel','2026-01-15 08:52:05'),(92,1,'Professional Services','#8b5cf6','professional','2026-01-15 08:52:05'),(93,1,'Marketing & Advertising','#ec4899','marketing','2026-01-15 08:52:05'),(94,1,'Utilities','#06b6d4','utilities','2026-01-15 08:52:05'),(95,1,'Equipment & Hardware','#6366f1','equipment','2026-01-15 08:52:05'),(96,1,'Meals & Entertainment','#f97316','meals','2026-01-15 08:52:05');
/*!40000 ALTER TABLE `expenseCategories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `expenses`
--

DROP TABLE IF EXISTS `expenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `expenses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `categoryId` int NOT NULL,
  `amount` decimal(24,8) NOT NULL,
  `currency` varchar(3) NOT NULL DEFAULT 'USD',
  `date` timestamp NOT NULL,
  `vendor` varchar(255) DEFAULT NULL,
  `description` text NOT NULL,
  `notes` text,
  `receiptUrl` text,
  `paymentMethod` enum('cash','credit_card','debit_card','bank_transfer','check','other') DEFAULT NULL,
  `isRecurring` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  `receiptKey` text,
  `taxAmount` decimal(24,8) NOT NULL DEFAULT '0.00000000',
  `isBillable` tinyint(1) NOT NULL DEFAULT '0',
  `clientId` int DEFAULT NULL,
  `invoiceId` int DEFAULT NULL,
  `billedAt` timestamp NULL DEFAULT NULL,
  `isTaxDeductible` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=97 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expenses`
--

LOCK TABLES `expenses` WRITE;
/*!40000 ALTER TABLE `expenses` DISABLE KEYS */;
INSERT INTO `expenses` VALUES (89,1,89,299.99000000,'USD','2025-12-20 06:52:05','GitHub Inc','GitHub Enterprise subscription',NULL,NULL,'credit_card',0,'2026-01-15 08:52:05','2026-01-15 08:52:05',NULL,0.00000000,0,NULL,NULL,NULL,0),(90,1,89,49.99000000,'USD','2025-11-17 06:52:05','Slack Technologies','Slack Business+ subscription',NULL,NULL,'credit_card',0,'2026-01-15 08:52:05','2026-01-15 08:52:05',NULL,0.00000000,0,NULL,NULL,NULL,0),(91,1,89,199.00000000,'USD','2025-12-28 06:52:05','JetBrains','JetBrains All Products Pack',NULL,NULL,'credit_card',0,'2026-01-15 08:52:05','2026-01-15 08:52:05',NULL,0.00000000,0,NULL,NULL,NULL,0),(92,1,92,1500.00000000,'USD','2025-11-22 06:52:05','Smith & Associates','Legal consultation - contract review',NULL,NULL,'credit_card',0,'2026-01-15 08:52:05','2026-01-15 08:52:05',NULL,0.00000000,0,NULL,NULL,NULL,0),(93,1,91,450.00000000,'USD','2025-12-25 06:52:05','United Airlines','Client meeting travel - NYC',NULL,NULL,'credit_card',0,'2026-01-15 08:52:05','2026-01-15 08:52:05',NULL,0.00000000,0,NULL,NULL,NULL,0),(94,1,93,750.00000000,'USD','2025-12-06 06:52:05','Google Ads','Google Ads campaign - Q1',NULL,NULL,'credit_card',0,'2026-01-15 08:52:05','2026-01-15 08:52:05',NULL,0.00000000,0,NULL,NULL,NULL,0),(95,1,95,1299.00000000,'USD','2025-12-06 06:52:05','Apple Store','MacBook Pro 14\" - development laptop',NULL,NULL,'credit_card',0,'2026-01-15 08:52:05','2026-01-15 08:52:05',NULL,0.00000000,0,NULL,NULL,NULL,0),(96,1,96,125.50000000,'USD','2026-01-14 06:52:05','Blue Oak Grill','Team lunch meeting',NULL,NULL,'credit_card',0,'2026-01-15 08:52:05','2026-01-15 08:52:05',NULL,0.00000000,0,NULL,NULL,NULL,0);
/*!40000 ALTER TABLE `expenses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoiceCustomFieldValues`
--

DROP TABLE IF EXISTS `invoiceCustomFieldValues`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoiceCustomFieldValues` (
  `id` int NOT NULL AUTO_INCREMENT,
  `invoiceId` int NOT NULL,
  `customFieldId` int NOT NULL,
  `value` text NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_invoiceId` (`invoiceId`),
  KEY `idx_customFieldId` (`customFieldId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoiceCustomFieldValues`
--

LOCK TABLES `invoiceCustomFieldValues` WRITE;
/*!40000 ALTER TABLE `invoiceCustomFieldValues` DISABLE KEYS */;
/*!40000 ALTER TABLE `invoiceCustomFieldValues` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoiceGenerationLogs`
--

DROP TABLE IF EXISTS `invoiceGenerationLogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoiceGenerationLogs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `recurringInvoiceId` int NOT NULL,
  `generatedInvoiceId` int DEFAULT NULL,
  `generationDate` timestamp NOT NULL DEFAULT (now()),
  `status` enum('success','failed') NOT NULL,
  `errorMessage` text,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoiceGenerationLogs`
--

LOCK TABLES `invoiceGenerationLogs` WRITE;
/*!40000 ALTER TABLE `invoiceGenerationLogs` DISABLE KEYS */;
INSERT INTO `invoiceGenerationLogs` VALUES (33,63,NULL,'2025-12-18 06:52:05','success',NULL,'2026-01-15 08:52:05'),(34,59,NULL,'2025-12-24 06:52:05','success',NULL,'2026-01-15 08:52:05'),(35,58,NULL,'2025-12-29 06:52:05','failed','Template rendering error','2026-01-15 08:52:05'),(36,61,NULL,'2026-01-12 06:52:05','success',NULL,'2026-01-15 08:52:05'),(37,62,NULL,'2026-01-08 06:52:05','failed','Template rendering error','2026-01-15 08:52:05'),(38,59,NULL,'2026-01-07 06:52:05','failed','Template rendering error','2026-01-15 08:52:05'),(39,62,NULL,'2026-01-15 06:52:05','success',NULL,'2026-01-15 08:52:05'),(40,62,NULL,'2026-01-08 06:52:05','success',NULL,'2026-01-15 08:52:05');
/*!40000 ALTER TABLE `invoiceGenerationLogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoiceLineItems`
--

DROP TABLE IF EXISTS `invoiceLineItems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoiceLineItems` (
  `id` int NOT NULL AUTO_INCREMENT,
  `invoiceId` int NOT NULL,
  `description` text NOT NULL,
  `quantity` decimal(24,8) NOT NULL,
  `rate` decimal(24,8) NOT NULL,
  `amount` decimal(24,8) NOT NULL,
  `sortOrder` int NOT NULL DEFAULT '0',
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=343 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoiceLineItems`
--

LOCK TABLES `invoiceLineItems` WRITE;
/*!40000 ALTER TABLE `invoiceLineItems` DISABLE KEYS */;
INSERT INTO `invoiceLineItems` VALUES (321,105,'Web Development Services - Frontend implementation',2.00000000,255.00000000,510.00000000,0,'2026-01-15 08:52:05'),(322,105,'Security Audit and Hardening',1.00000000,590.00000000,590.00000000,1,'2026-01-15 08:52:05'),(323,105,'Security Audit and Hardening',11.00000000,365.00000000,4015.00000000,2,'2026-01-15 08:52:05'),(324,106,'Monthly Maintenance Retainer',17.00000000,395.00000000,6715.00000000,0,'2026-01-15 08:52:05'),(325,106,'Performance Optimization',3.00000000,1085.00000000,3255.00000000,1,'2026-01-15 08:52:05'),(326,106,'API Integration and Testing',11.00000000,1225.00000000,13475.00000000,2,'2026-01-15 08:52:05'),(327,107,'API Integration and Testing',14.00000000,805.00000000,11270.00000000,0,'2026-01-15 08:52:05'),(328,107,'API Integration and Testing',16.00000000,945.00000000,15120.00000000,1,'2026-01-15 08:52:05'),(329,108,'Technical Documentation',10.00000000,1245.00000000,12450.00000000,0,'2026-01-15 08:52:05'),(330,108,'Technical Documentation',3.00000000,545.00000000,1635.00000000,1,'2026-01-15 08:52:05'),(331,108,'Performance Optimization',3.00000000,1220.00000000,3660.00000000,2,'2026-01-15 08:52:05'),(332,108,'Database Design and Optimization',7.00000000,1000.00000000,7000.00000000,3,'2026-01-15 08:52:05'),(333,109,'Database Design and Optimization',19.00000000,985.00000000,18715.00000000,0,'2026-01-15 08:52:05'),(334,109,'API Integration and Testing',15.00000000,355.00000000,5325.00000000,1,'2026-01-15 08:52:05'),(335,109,'Security Audit and Hardening',19.00000000,720.00000000,13680.00000000,2,'2026-01-15 08:52:05'),(336,110,'Performance Optimization',3.00000000,480.00000000,1440.00000000,0,'2026-01-15 08:52:05'),(337,110,'Database Design and Optimization',4.00000000,970.00000000,3880.00000000,1,'2026-01-15 08:52:05'),(338,111,'Performance Optimization',7.00000000,250.00000000,1750.00000000,0,'2026-01-15 08:52:05'),(339,111,'Web Development Services - Frontend implementation',12.00000000,755.00000000,9060.00000000,1,'2026-01-15 08:52:05'),(340,112,'Security Audit and Hardening',20.00000000,630.00000000,12600.00000000,0,'2026-01-15 08:52:05'),(341,112,'Database Design and Optimization',17.00000000,560.00000000,9520.00000000,1,'2026-01-15 08:52:05'),(342,112,'Monthly Maintenance Retainer',11.00000000,470.00000000,5170.00000000,2,'2026-01-15 08:52:05');
/*!40000 ALTER TABLE `invoiceLineItems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoices`
--

DROP TABLE IF EXISTS `invoices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoices` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `clientId` int NOT NULL,
  `invoiceNumber` varchar(50) NOT NULL,
  `status` enum('draft','sent','viewed','paid','overdue','canceled') NOT NULL DEFAULT 'draft',
  `subtotal` decimal(24,8) NOT NULL,
  `taxRate` decimal(5,2) NOT NULL DEFAULT '0.00',
  `taxAmount` decimal(24,8) NOT NULL DEFAULT '0.00000000',
  `discountType` enum('percentage','fixed') DEFAULT 'percentage',
  `discountValue` decimal(24,8) NOT NULL DEFAULT '0.00000000',
  `discountAmount` decimal(24,8) NOT NULL DEFAULT '0.00000000',
  `total` decimal(24,8) NOT NULL,
  `amountPaid` decimal(24,8) NOT NULL DEFAULT '0.00000000',
  `cryptoAmount` decimal(24,18) DEFAULT NULL,
  `cryptoCurrency` varchar(10) DEFAULT NULL,
  `cryptoPaymentId` varchar(100) DEFAULT NULL,
  `cryptoPaymentUrl` text,
  `stripePaymentLinkId` varchar(255) DEFAULT NULL,
  `stripePaymentLinkUrl` text,
  `stripeSessionId` varchar(255) DEFAULT NULL,
  `notes` text,
  `templateId` int DEFAULT NULL,
  `firstViewedAt` timestamp NULL DEFAULT NULL,
  `paymentTerms` text,
  `issueDate` timestamp NOT NULL,
  `dueDate` timestamp NOT NULL,
  `sentAt` timestamp NULL DEFAULT NULL,
  `paidAt` timestamp NULL DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  `currency` varchar(3) NOT NULL DEFAULT 'USD',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_invoice_number_per_user` (`userId`,`invoiceNumber`),
  KEY `idx_invoices_user_status` (`userId`,`status`),
  KEY `idx_invoices_user_duedate` (`userId`,`dueDate`),
  KEY `idx_invoices_client` (`clientId`),
  KEY `idx_invoices_created` (`createdAt`)
) ENGINE=InnoDB AUTO_INCREMENT=113 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoices`
--

LOCK TABLES `invoices` WRITE;
/*!40000 ALTER TABLE `invoices` DISABLE KEYS */;
INSERT INTO `invoices` VALUES (105,1,137,'INV-2026-001','paid',2500.00000000,8.50,212.50000000,'percentage',0.00000000,0.00000000,2712.50000000,2712.50000000,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Payment due within 30 days',79,NULL,'Net 30','2025-12-16 06:52:05','2026-01-15 06:52:05',NULL,NULL,'2026-01-15 08:52:05','2026-01-15 08:52:05','USD'),(106,1,138,'INV-2026-002','sent',1800.00000000,0.00,0.00000000,'percentage',0.00000000,0.00000000,1800.00000000,0.00000000,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Payment due within 30 days',80,NULL,'Net 30','2025-12-31 06:52:05','2026-01-30 06:52:05',NULL,NULL,'2026-01-15 08:52:05','2026-01-15 08:52:05','USD'),(107,1,139,'INV-2026-003','overdue',3200.00000000,10.00,320.00000000,'percentage',0.00000000,0.00000000,3520.00000000,0.00000000,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Payment due within 30 days',81,NULL,'Net 30','2025-12-01 06:52:05','2025-12-31 06:52:05',NULL,NULL,'2026-01-15 08:52:05','2026-01-15 08:52:05','USD'),(108,1,140,'INV-2026-004','draft',950.00000000,5.00,47.50000000,'percentage',0.00000000,0.00000000,997.50000000,0.00000000,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Payment due within 30 days',79,NULL,'Net 30','2026-01-14 06:52:05','2026-02-13 06:52:05',NULL,NULL,'2026-01-15 08:52:05','2026-01-15 08:52:05','USD'),(109,1,141,'INV-2026-005','paid',5400.00000000,8.25,445.50000000,'percentage',0.00000000,0.00000000,5845.50000000,5845.50000000,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Payment due within 30 days',82,NULL,'Net 30','2025-11-16 06:52:05','2025-12-16 06:52:05',NULL,NULL,'2026-01-15 08:52:05','2026-01-15 08:52:05','USD'),(110,1,142,'INV-2026-006','sent',1200.00000000,0.00,0.00000000,'percentage',0.00000000,0.00000000,1200.00000000,0.00000000,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Payment due within 30 days',83,NULL,'Net 30','2026-01-05 06:52:05','2026-02-04 06:52:05',NULL,NULL,'2026-01-15 08:52:05','2026-01-15 08:52:05','USD'),(111,1,143,'INV-2026-007','draft',3750.00000000,7.00,262.50000000,'percentage',0.00000000,0.00000000,4012.50000000,0.00000000,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Payment due within 30 days',84,NULL,'Net 30','2026-01-13 06:52:05','2026-02-12 06:52:05',NULL,NULL,'2026-01-15 08:52:05','2026-01-15 08:52:05','USD'),(112,1,144,'INV-2026-008','paid',2100.00000000,6.00,126.00000000,'percentage',0.00000000,0.00000000,2226.00000000,2226.00000000,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Payment due within 30 days',80,NULL,'Net 30','2025-12-26 06:52:05','2026-01-05 06:52:05',NULL,NULL,'2026-01-15 08:52:05','2026-01-15 08:52:05','USD');
/*!40000 ALTER TABLE `invoices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoiceTemplates`
--

DROP TABLE IF EXISTS `invoiceTemplates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoiceTemplates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `isDefault` tinyint(1) NOT NULL DEFAULT '0',
  `templateType` enum('sleek','modern','classic','minimal','bold','professional','creative') NOT NULL DEFAULT 'sleek',
  `primaryColor` varchar(7) NOT NULL DEFAULT '#3b82f6',
  `secondaryColor` varchar(7) NOT NULL DEFAULT '#64748b',
  `accentColor` varchar(7) NOT NULL DEFAULT '#10b981',
  `headingFont` varchar(50) NOT NULL DEFAULT 'Inter',
  `fontFamily` varchar(50) NOT NULL DEFAULT 'Inter',
  `fontSize` int NOT NULL DEFAULT '14',
  `logoPosition` enum('left','center','right') NOT NULL DEFAULT 'left',
  `showCompanyAddress` tinyint(1) NOT NULL DEFAULT '1',
  `showPaymentTerms` tinyint(1) NOT NULL DEFAULT '1',
  `footerText` text,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  `bodyFont` varchar(50) NOT NULL DEFAULT 'Inter',
  `logoUrl` text,
  `logoWidth` int NOT NULL DEFAULT '150',
  `headerLayout` enum('standard','centered','split') NOT NULL DEFAULT 'standard',
  `footerLayout` enum('simple','detailed','minimal') NOT NULL DEFAULT 'simple',
  `showTaxField` tinyint(1) NOT NULL DEFAULT '1',
  `showDiscountField` tinyint(1) NOT NULL DEFAULT '1',
  `showNotesField` tinyint(1) NOT NULL DEFAULT '1',
  `language` varchar(10) NOT NULL DEFAULT 'en',
  `dateFormat` varchar(20) NOT NULL DEFAULT 'MM/DD/YYYY',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=86 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoiceTemplates`
--

LOCK TABLES `invoiceTemplates` WRITE;
/*!40000 ALTER TABLE `invoiceTemplates` DISABLE KEYS */;
INSERT INTO `invoiceTemplates` VALUES (1,1,'Professional Dark',0,'sleek','#0f172a','#1e293b','#3b82f6','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:39:34','2026-01-15 08:39:34','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(2,1,'Classic Blue',0,'sleek','#1e40af','#3b82f6','#60a5fa','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:39:34','2026-01-15 08:39:34','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(3,1,'Modern Green',0,'sleek','#059669','#10b981','#34d399','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:39:34','2026-01-15 08:39:34','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(4,1,'Bold Red',0,'sleek','#dc2626','#ef4444','#f87171','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:39:34','2026-01-15 08:39:34','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(5,1,'Elegant Purple',0,'sleek','#7c3aed','#8b5cf6','#a78bfa','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:39:34','2026-01-15 08:39:34','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(6,1,'Tech Cyan',0,'sleek','#0284c7','#0ea5e9','#38bdf8','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:39:34','2026-01-15 08:39:34','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(7,1,'Professional Dark',0,'sleek','#0f172a','#1e293b','#3b82f6','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:40:04','2026-01-15 08:40:04','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(8,1,'Classic Blue',0,'sleek','#1e40af','#3b82f6','#60a5fa','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:40:04','2026-01-15 08:40:04','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(9,1,'Modern Green',0,'sleek','#059669','#10b981','#34d399','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:40:04','2026-01-15 08:40:04','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(10,1,'Bold Red',0,'sleek','#dc2626','#ef4444','#f87171','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:40:04','2026-01-15 08:40:04','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(11,1,'Elegant Purple',0,'sleek','#7c3aed','#8b5cf6','#a78bfa','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:40:04','2026-01-15 08:40:04','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(12,1,'Tech Cyan',0,'sleek','#0284c7','#0ea5e9','#38bdf8','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:40:04','2026-01-15 08:40:04','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(13,1,'Professional Dark',0,'sleek','#0f172a','#1e293b','#3b82f6','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:41:07','2026-01-15 08:41:07','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(14,1,'Classic Blue',0,'sleek','#1e40af','#3b82f6','#60a5fa','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:41:07','2026-01-15 08:41:07','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(15,1,'Modern Green',0,'sleek','#059669','#10b981','#34d399','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:41:07','2026-01-15 08:41:07','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(16,1,'Bold Red',0,'sleek','#dc2626','#ef4444','#f87171','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:41:07','2026-01-15 08:41:07','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(17,1,'Elegant Purple',0,'sleek','#7c3aed','#8b5cf6','#a78bfa','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:41:07','2026-01-15 08:41:07','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(18,1,'Tech Cyan',0,'sleek','#0284c7','#0ea5e9','#38bdf8','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:41:07','2026-01-15 08:41:07','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(19,1,'Professional Dark',0,'sleek','#0f172a','#1e293b','#3b82f6','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:42:15','2026-01-15 08:42:15','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(20,1,'Classic Blue',0,'sleek','#1e40af','#3b82f6','#60a5fa','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:42:15','2026-01-15 08:42:15','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(21,1,'Modern Green',0,'sleek','#059669','#10b981','#34d399','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:42:15','2026-01-15 08:42:15','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(22,1,'Bold Red',0,'sleek','#dc2626','#ef4444','#f87171','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:42:15','2026-01-15 08:42:15','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(23,1,'Elegant Purple',0,'sleek','#7c3aed','#8b5cf6','#a78bfa','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:42:15','2026-01-15 08:42:15','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(24,1,'Tech Cyan',0,'sleek','#0284c7','#0ea5e9','#38bdf8','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:42:15','2026-01-15 08:42:15','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(25,1,'Professional Dark',0,'sleek','#0f172a','#1e293b','#3b82f6','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:42:35','2026-01-15 08:42:35','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(26,1,'Classic Blue',0,'sleek','#1e40af','#3b82f6','#60a5fa','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:42:35','2026-01-15 08:42:35','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(27,1,'Modern Green',0,'sleek','#059669','#10b981','#34d399','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:42:35','2026-01-15 08:42:35','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(28,1,'Bold Red',0,'sleek','#dc2626','#ef4444','#f87171','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:42:35','2026-01-15 08:42:35','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(29,1,'Elegant Purple',0,'sleek','#7c3aed','#8b5cf6','#a78bfa','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:42:35','2026-01-15 08:42:35','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(30,1,'Tech Cyan',0,'sleek','#0284c7','#0ea5e9','#38bdf8','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:42:35','2026-01-15 08:42:35','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(31,1,'Professional Dark',0,'sleek','#0f172a','#1e293b','#3b82f6','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:43:04','2026-01-15 08:43:04','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(32,1,'Classic Blue',0,'sleek','#1e40af','#3b82f6','#60a5fa','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:43:04','2026-01-15 08:43:04','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(33,1,'Modern Green',0,'sleek','#059669','#10b981','#34d399','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:43:04','2026-01-15 08:43:04','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(34,1,'Bold Red',0,'sleek','#dc2626','#ef4444','#f87171','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:43:04','2026-01-15 08:43:04','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(35,1,'Elegant Purple',0,'sleek','#7c3aed','#8b5cf6','#a78bfa','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:43:04','2026-01-15 08:43:04','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(36,1,'Tech Cyan',0,'sleek','#0284c7','#0ea5e9','#38bdf8','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:43:04','2026-01-15 08:43:04','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(37,1,'Professional Dark',0,'sleek','#0f172a','#1e293b','#3b82f6','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:43:41','2026-01-15 08:43:41','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(38,1,'Classic Blue',0,'sleek','#1e40af','#3b82f6','#60a5fa','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:43:41','2026-01-15 08:43:41','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(39,1,'Modern Green',0,'sleek','#059669','#10b981','#34d399','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:43:41','2026-01-15 08:43:41','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(40,1,'Bold Red',0,'sleek','#dc2626','#ef4444','#f87171','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:43:41','2026-01-15 08:43:41','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(41,1,'Elegant Purple',0,'sleek','#7c3aed','#8b5cf6','#a78bfa','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:43:41','2026-01-15 08:43:41','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(42,1,'Tech Cyan',0,'sleek','#0284c7','#0ea5e9','#38bdf8','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:43:41','2026-01-15 08:43:41','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(43,1,'Professional Dark',0,'sleek','#0f172a','#1e293b','#3b82f6','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:44:01','2026-01-15 08:44:01','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(44,1,'Classic Blue',0,'sleek','#1e40af','#3b82f6','#60a5fa','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:44:01','2026-01-15 08:44:01','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(45,1,'Modern Green',0,'sleek','#059669','#10b981','#34d399','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:44:01','2026-01-15 08:44:01','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(46,1,'Bold Red',0,'sleek','#dc2626','#ef4444','#f87171','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:44:01','2026-01-15 08:44:01','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(47,1,'Elegant Purple',0,'sleek','#7c3aed','#8b5cf6','#a78bfa','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:44:01','2026-01-15 08:44:01','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(48,1,'Tech Cyan',0,'sleek','#0284c7','#0ea5e9','#38bdf8','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:44:01','2026-01-15 08:44:01','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(49,1,'Professional Dark',0,'sleek','#0f172a','#1e293b','#3b82f6','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:44:32','2026-01-15 08:44:32','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(50,1,'Classic Blue',0,'sleek','#1e40af','#3b82f6','#60a5fa','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:44:32','2026-01-15 08:44:32','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(51,1,'Modern Green',0,'sleek','#059669','#10b981','#34d399','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:44:32','2026-01-15 08:44:32','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(52,1,'Bold Red',0,'sleek','#dc2626','#ef4444','#f87171','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:44:32','2026-01-15 08:44:32','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(53,1,'Elegant Purple',0,'sleek','#7c3aed','#8b5cf6','#a78bfa','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:44:32','2026-01-15 08:44:32','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(54,1,'Tech Cyan',0,'sleek','#0284c7','#0ea5e9','#38bdf8','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:44:32','2026-01-15 08:44:32','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(55,1,'Professional Dark',0,'sleek','#0f172a','#1e293b','#3b82f6','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:45:01','2026-01-15 08:45:01','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(56,1,'Classic Blue',0,'sleek','#1e40af','#3b82f6','#60a5fa','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:45:01','2026-01-15 08:45:01','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(57,1,'Modern Green',0,'sleek','#059669','#10b981','#34d399','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:45:01','2026-01-15 08:45:01','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(58,1,'Bold Red',0,'sleek','#dc2626','#ef4444','#f87171','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:45:01','2026-01-15 08:45:01','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(59,1,'Elegant Purple',0,'sleek','#7c3aed','#8b5cf6','#a78bfa','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:45:01','2026-01-15 08:45:01','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(60,1,'Tech Cyan',0,'sleek','#0284c7','#0ea5e9','#38bdf8','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:45:01','2026-01-15 08:45:01','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(61,1,'Professional Dark',0,'sleek','#0f172a','#1e293b','#3b82f6','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:45:33','2026-01-15 08:45:33','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(62,1,'Classic Blue',0,'sleek','#1e40af','#3b82f6','#60a5fa','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:45:33','2026-01-15 08:45:33','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(63,1,'Modern Green',0,'sleek','#059669','#10b981','#34d399','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:45:33','2026-01-15 08:45:33','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(64,1,'Bold Red',0,'sleek','#dc2626','#ef4444','#f87171','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:45:33','2026-01-15 08:45:33','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(65,1,'Elegant Purple',0,'sleek','#7c3aed','#8b5cf6','#a78bfa','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:45:33','2026-01-15 08:45:33','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(66,1,'Tech Cyan',0,'sleek','#0284c7','#0ea5e9','#38bdf8','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:45:33','2026-01-15 08:45:33','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(67,1,'Professional Dark',0,'sleek','#0f172a','#1e293b','#3b82f6','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:45:57','2026-01-15 08:45:57','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(68,1,'Classic Blue',0,'sleek','#1e40af','#3b82f6','#60a5fa','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:45:57','2026-01-15 08:45:57','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(69,1,'Modern Green',0,'sleek','#059669','#10b981','#34d399','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:45:57','2026-01-15 08:45:57','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(70,1,'Bold Red',0,'sleek','#dc2626','#ef4444','#f87171','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:45:57','2026-01-15 08:45:57','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(71,1,'Elegant Purple',0,'sleek','#7c3aed','#8b5cf6','#a78bfa','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:45:57','2026-01-15 08:45:57','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(72,1,'Tech Cyan',0,'sleek','#0284c7','#0ea5e9','#38bdf8','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:45:57','2026-01-15 08:45:57','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(73,1,'Professional Dark',0,'professional','#0f172a','#1e293b','#3b82f6','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:50:52','2026-01-15 08:50:52','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(74,1,'Classic Blue',0,'classic','#1e40af','#3b82f6','#60a5fa','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:50:52','2026-01-15 08:50:52','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(75,1,'Modern Green',0,'modern','#059669','#10b981','#34d399','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:50:52','2026-01-15 08:50:52','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(76,1,'Bold Red',0,'bold','#dc2626','#ef4444','#f87171','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:50:52','2026-01-15 08:50:52','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(77,1,'Elegant Purple',0,'creative','#7c3aed','#8b5cf6','#a78bfa','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:50:52','2026-01-15 08:50:52','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(78,1,'Tech Cyan',0,'minimal','#0284c7','#0ea5e9','#38bdf8','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:50:52','2026-01-15 08:50:52','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(79,1,'Professional Dark',0,'professional','#0f172a','#1e293b','#3b82f6','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:52:05','2026-01-15 08:52:05','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(80,1,'Classic Blue',0,'classic','#1e40af','#3b82f6','#60a5fa','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:52:05','2026-01-15 08:52:05','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(81,1,'Modern Green',0,'modern','#059669','#10b981','#34d399','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:52:05','2026-01-15 08:52:05','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(82,1,'Bold Red',0,'bold','#dc2626','#ef4444','#f87171','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:52:05','2026-01-15 08:52:05','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(83,1,'Elegant Purple',0,'creative','#7c3aed','#8b5cf6','#a78bfa','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:52:05','2026-01-15 08:52:05','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(84,1,'Tech Cyan',0,'minimal','#0284c7','#0ea5e9','#38bdf8','Inter','Inter',14,'left',1,1,NULL,'2026-01-15 08:52:05','2026-01-15 08:52:05','Inter',NULL,150,'standard','simple',1,1,1,'en','MM/DD/YYYY'),(85,1,'Sleek - Default',1,'sleek','#5f6fff','#1e293b','#10b981','Inter','Inter',14,'left',1,1,'Thank you for your business!','2026-01-15 09:05:04','2026-01-15 09:05:04','Inter',NULL,120,'split','simple',1,1,1,'en','MM/DD/YYYY');
/*!40000 ALTER TABLE `invoiceTemplates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoiceViews`
--

DROP TABLE IF EXISTS `invoiceViews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoiceViews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `invoiceId` int NOT NULL,
  `viewedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ipAddress` varchar(45) DEFAULT NULL,
  `userAgent` text,
  `isFirstView` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_invoiceId` (`invoiceId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoiceViews`
--

LOCK TABLES `invoiceViews` WRITE;
/*!40000 ALTER TABLE `invoiceViews` DISABLE KEYS */;
INSERT INTO `invoiceViews` VALUES (6,105,'2026-01-01 06:52:05','192.168.1.100',NULL,1,'2026-01-15 08:52:05'),(7,106,'2026-01-05 06:52:05','192.168.1.100',NULL,1,'2026-01-15 08:52:05'),(8,107,'2026-01-03 06:52:05','192.168.1.100',NULL,1,'2026-01-15 08:52:05'),(9,108,'2025-12-27 06:52:05','192.168.1.100',NULL,1,'2026-01-15 08:52:05'),(10,109,'2026-01-01 06:52:05','192.168.1.100',NULL,1,'2026-01-15 08:52:05');
/*!40000 ALTER TABLE `invoiceViews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paymentGateways`
--

DROP TABLE IF EXISTS `paymentGateways`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `paymentGateways` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `provider` enum('stripe_connect','coinbase_commerce') NOT NULL,
  `config` text NOT NULL,
  `isEnabled` tinyint(1) NOT NULL DEFAULT '1',
  `displayName` varchar(100) DEFAULT NULL,
  `lastTestedAt` timestamp NULL DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_provider_idx` (`userId`,`provider`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paymentGateways`
--

LOCK TABLES `paymentGateways` WRITE;
/*!40000 ALTER TABLE `paymentGateways` DISABLE KEYS */;
/*!40000 ALTER TABLE `paymentGateways` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `invoiceId` int NOT NULL,
  `userId` int NOT NULL,
  `amount` decimal(24,8) NOT NULL,
  `currency` varchar(3) NOT NULL DEFAULT 'USD',
  `paymentMethod` enum('stripe','manual','bank_transfer','check','cash') NOT NULL,
  `stripePaymentIntentId` varchar(255) DEFAULT NULL,
  `cryptoAmount` decimal(24,18) DEFAULT NULL,
  `cryptoCurrency` varchar(10) DEFAULT NULL,
  `cryptoNetwork` varchar(20) DEFAULT NULL,
  `cryptoTxHash` varchar(100) DEFAULT NULL,
  `cryptoWalletAddress` varchar(100) DEFAULT NULL,
  `paymentDate` timestamp NOT NULL,
  `receivedDate` timestamp NULL DEFAULT NULL,
  `status` enum('pending','completed','failed','refunded') NOT NULL DEFAULT 'completed',
  `notes` text,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_payments_invoice` (`invoiceId`),
  KEY `idx_payments_user` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (37,105,1,2712.50000000,'USD','stripe',NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-15 08:52:05',NULL,'completed',NULL,'2026-01-15 08:52:05','2026-01-15 08:52:05'),(38,109,1,5845.50000000,'USD','bank_transfer',NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-15 08:52:05',NULL,'completed',NULL,'2026-01-15 08:52:05','2026-01-15 08:52:05'),(39,112,1,2226.00000000,'USD','stripe',NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-15 08:52:05',NULL,'completed',NULL,'2026-01-15 08:52:05','2026-01-15 08:52:05');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `rate` decimal(24,8) NOT NULL,
  `unit` varchar(50) DEFAULT 'unit',
  `category` varchar(100) DEFAULT NULL,
  `sku` varchar(100) DEFAULT NULL,
  `taxable` tinyint(1) NOT NULL DEFAULT '1',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `usageCount` int NOT NULL DEFAULT '0',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_userId` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,1,'Web Development Hourly','Frontend and backend web development services',150.00000000,'hour','Development',NULL,1,1,19,'2026-01-15 08:50:52','2026-01-15 08:50:52'),(2,1,'Mobile App Development','iOS and Android application development',175.00000000,'hour','Development',NULL,1,1,7,'2026-01-15 08:50:52','2026-01-15 08:50:52'),(3,1,'UI/UX Design','User interface and experience design services',125.00000000,'hour','Design',NULL,1,1,19,'2026-01-15 08:50:52','2026-01-15 08:50:52'),(4,1,'Database Optimization','Performance tuning and optimization',200.00000000,'hour','Development',NULL,1,1,6,'2026-01-15 08:50:52','2026-01-15 08:50:52'),(5,1,'API Integration','Third-party API integration services',140.00000000,'hour','Development',NULL,1,1,14,'2026-01-15 08:50:52','2026-01-15 08:50:52'),(6,1,'Security Audit','Comprehensive security assessment',250.00000000,'hour','Consulting',NULL,1,1,9,'2026-01-15 08:50:52','2026-01-15 08:50:52'),(7,1,'Cloud Setup','AWS/GCP cloud infrastructure setup',180.00000000,'hour','DevOps',NULL,1,1,6,'2026-01-15 08:50:52','2026-01-15 08:50:52'),(8,1,'Monthly Maintenance','Ongoing maintenance and support',500.00000000,'month','Support',NULL,1,1,10,'2026-01-15 08:50:52','2026-01-15 08:50:52'),(9,1,'Web Development Hourly','Frontend and backend web development services',150.00000000,'hour','Development',NULL,1,1,9,'2026-01-15 08:52:05','2026-01-15 08:52:05'),(10,1,'Mobile App Development','iOS and Android application development',175.00000000,'hour','Development',NULL,1,1,3,'2026-01-15 08:52:05','2026-01-15 08:52:05'),(11,1,'UI/UX Design','User interface and experience design services',125.00000000,'hour','Design',NULL,1,1,9,'2026-01-15 08:52:05','2026-01-15 08:52:05'),(12,1,'Database Optimization','Performance tuning and optimization',200.00000000,'hour','Development',NULL,1,1,6,'2026-01-15 08:52:05','2026-01-15 08:52:05'),(13,1,'API Integration','Third-party API integration services',140.00000000,'hour','Development',NULL,1,1,11,'2026-01-15 08:52:05','2026-01-15 08:52:05'),(14,1,'Security Audit','Comprehensive security assessment',250.00000000,'hour','Consulting',NULL,1,1,10,'2026-01-15 08:52:05','2026-01-15 08:52:05'),(15,1,'Cloud Setup','AWS/GCP cloud infrastructure setup',180.00000000,'hour','DevOps',NULL,1,1,16,'2026-01-15 08:52:05','2026-01-15 08:52:05'),(16,1,'Monthly Maintenance','Ongoing maintenance and support',500.00000000,'month','Support',NULL,1,1,15,'2026-01-15 08:52:05','2026-01-15 08:52:05');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quickbooksConnections`
--

DROP TABLE IF EXISTS `quickbooksConnections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quickbooksConnections` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `realmId` varchar(50) NOT NULL,
  `companyName` varchar(255) DEFAULT NULL,
  `accessToken` text NOT NULL,
  `refreshToken` text NOT NULL,
  `tokenExpiresAt` timestamp NOT NULL,
  `refreshTokenExpiresAt` timestamp NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `environment` enum('sandbox','production') NOT NULL DEFAULT 'sandbox',
  `lastSyncAt` timestamp NULL DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `userId` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quickbooksConnections`
--

LOCK TABLES `quickbooksConnections` WRITE;
/*!40000 ALTER TABLE `quickbooksConnections` DISABLE KEYS */;
/*!40000 ALTER TABLE `quickbooksConnections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quickbooksCustomerMapping`
--

DROP TABLE IF EXISTS `quickbooksCustomerMapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quickbooksCustomerMapping` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `clientId` int NOT NULL,
  `qbCustomerId` varchar(50) NOT NULL,
  `qbDisplayName` varchar(255) DEFAULT NULL,
  `syncVersion` int NOT NULL DEFAULT '1',
  `lastSyncedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `qb_customer_client_idx` (`userId`,`clientId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quickbooksCustomerMapping`
--

LOCK TABLES `quickbooksCustomerMapping` WRITE;
/*!40000 ALTER TABLE `quickbooksCustomerMapping` DISABLE KEYS */;
/*!40000 ALTER TABLE `quickbooksCustomerMapping` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quickbooksInvoiceMapping`
--

DROP TABLE IF EXISTS `quickbooksInvoiceMapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quickbooksInvoiceMapping` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `invoiceId` int NOT NULL,
  `qbInvoiceId` varchar(50) NOT NULL,
  `qbDocNumber` varchar(50) DEFAULT NULL,
  `syncVersion` int NOT NULL DEFAULT '1',
  `lastSyncedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `qb_invoice_idx` (`userId`,`invoiceId`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quickbooksInvoiceMapping`
--

LOCK TABLES `quickbooksInvoiceMapping` WRITE;
/*!40000 ALTER TABLE `quickbooksInvoiceMapping` DISABLE KEYS */;
INSERT INTO `quickbooksInvoiceMapping` VALUES (12,1,111,'QB-SAVWKB9K',NULL,1,'2026-01-15 08:52:05','2026-01-15 08:52:05'),(13,1,107,'QB-R626WT0I',NULL,1,'2026-01-15 08:52:05','2026-01-15 08:52:05'),(14,1,106,'QB-AXR03PTK',NULL,1,'2026-01-15 08:52:05','2026-01-15 08:52:05');
/*!40000 ALTER TABLE `quickbooksInvoiceMapping` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quickbooksSyncLog`
--

DROP TABLE IF EXISTS `quickbooksSyncLog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quickbooksSyncLog` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `entityType` enum('customer','invoice','payment') NOT NULL,
  `entityId` int NOT NULL,
  `qbEntityId` varchar(50) DEFAULT NULL,
  `action` enum('create','update','delete') NOT NULL,
  `status` enum('success','failed','pending') NOT NULL,
  `errorMessage` text,
  `requestPayload` text,
  `responsePayload` text,
  `syncedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_userId` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quickbooksSyncLog`
--

LOCK TABLES `quickbooksSyncLog` WRITE;
/*!40000 ALTER TABLE `quickbooksSyncLog` DISABLE KEYS */;
/*!40000 ALTER TABLE `quickbooksSyncLog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quickbooksSyncSettings`
--

DROP TABLE IF EXISTS `quickbooksSyncSettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quickbooksSyncSettings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `autoSyncInvoices` tinyint(1) NOT NULL DEFAULT '1',
  `autoSyncPayments` tinyint(1) NOT NULL DEFAULT '1',
  `syncPaymentsFromQB` tinyint(1) NOT NULL DEFAULT '1',
  `minInvoiceAmount` decimal(24,8) DEFAULT NULL,
  `syncDraftInvoices` tinyint(1) NOT NULL DEFAULT '0',
  `lastPaymentPollAt` timestamp NULL DEFAULT NULL,
  `pollIntervalMinutes` int NOT NULL DEFAULT '60',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `userId` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quickbooksSyncSettings`
--

LOCK TABLES `quickbooksSyncSettings` WRITE;
/*!40000 ALTER TABLE `quickbooksSyncSettings` DISABLE KEYS */;
/*!40000 ALTER TABLE `quickbooksSyncSettings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recurringInvoiceLineItems`
--

DROP TABLE IF EXISTS `recurringInvoiceLineItems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recurringInvoiceLineItems` (
  `id` int NOT NULL AUTO_INCREMENT,
  `recurringInvoiceId` int NOT NULL,
  `description` text NOT NULL,
  `quantity` decimal(24,8) NOT NULL,
  `rate` decimal(24,8) NOT NULL,
  `sortOrder` int NOT NULL DEFAULT '0',
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=175 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recurringInvoiceLineItems`
--

LOCK TABLES `recurringInvoiceLineItems` WRITE;
/*!40000 ALTER TABLE `recurringInvoiceLineItems` DISABLE KEYS */;
INSERT INTO `recurringInvoiceLineItems` VALUES (156,58,'Performance optimization',6.00000000,145.00000000,0,'2026-01-15 08:52:05'),(157,58,'Analytics and reporting',11.00000000,245.00000000,1,'2026-01-15 08:52:05'),(158,58,'Analytics and reporting',5.00000000,235.00000000,2,'2026-01-15 08:52:05'),(159,59,'Website maintenance and updates',8.00000000,150.00000000,0,'2026-01-15 08:52:05'),(160,59,'Website maintenance and updates',11.00000000,315.00000000,1,'2026-01-15 08:52:05'),(161,59,'API maintenance and monitoring',10.00000000,160.00000000,2,'2026-01-15 08:52:05'),(162,59,'Analytics and reporting',7.00000000,280.00000000,3,'2026-01-15 08:52:05'),(163,60,'Analytics and reporting',8.00000000,145.00000000,0,'2026-01-15 08:52:05'),(164,60,'Bug fixes and security patches',11.00000000,195.00000000,1,'2026-01-15 08:52:05'),(165,60,'Website maintenance and updates',6.00000000,235.00000000,2,'2026-01-15 08:52:05'),(166,60,'API maintenance and monitoring',9.00000000,245.00000000,3,'2026-01-15 08:52:05'),(167,61,'Performance optimization',14.00000000,305.00000000,0,'2026-01-15 08:52:05'),(168,61,'Analytics and reporting',7.00000000,160.00000000,1,'2026-01-15 08:52:05'),(169,62,'Bug fixes and security patches',11.00000000,320.00000000,0,'2026-01-15 08:52:05'),(170,62,'Website maintenance and updates',6.00000000,185.00000000,1,'2026-01-15 08:52:05'),(171,62,'API maintenance and monitoring',5.00000000,120.00000000,2,'2026-01-15 08:52:05'),(172,63,'Website maintenance and updates',13.00000000,290.00000000,0,'2026-01-15 08:52:05'),(173,63,'Analytics and reporting',12.00000000,110.00000000,1,'2026-01-15 08:52:05'),(174,63,'Analytics and reporting',10.00000000,260.00000000,2,'2026-01-15 08:52:05');
/*!40000 ALTER TABLE `recurringInvoiceLineItems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recurringInvoices`
--

DROP TABLE IF EXISTS `recurringInvoices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recurringInvoices` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `clientId` int NOT NULL,
  `frequency` enum('weekly','monthly','yearly') NOT NULL,
  `startDate` timestamp NOT NULL,
  `endDate` timestamp NULL DEFAULT NULL,
  `nextInvoiceDate` timestamp NOT NULL,
  `invoiceNumberPrefix` varchar(50) NOT NULL,
  `taxRate` decimal(5,2) NOT NULL DEFAULT '0.00',
  `discountType` enum('percentage','fixed') DEFAULT 'percentage',
  `discountValue` decimal(10,2) NOT NULL DEFAULT '0.00',
  `notes` text,
  `paymentTerms` text,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `lastGeneratedAt` timestamp NULL DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_recurring_user_next` (`userId`,`nextInvoiceDate`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recurringInvoices`
--

LOCK TABLES `recurringInvoices` WRITE;
/*!40000 ALTER TABLE `recurringInvoices` DISABLE KEYS */;
INSERT INTO `recurringInvoices` VALUES (58,1,137,'monthly','2025-10-17 04:52:05',NULL,'2026-02-14 06:52:05','REC-WEB',8.00,'percentage',0.00,'Web development retainer','Net 30',1,NULL,'2026-01-15 08:52:05','2026-01-15 08:52:05'),(59,1,138,'weekly','2025-10-17 04:52:05',NULL,'2026-02-14 06:52:05','REC-MOBILE',8.00,'percentage',0.00,'Mobile app maintenance','Net 30',1,NULL,'2026-01-15 08:52:05','2026-01-15 08:52:05'),(60,1,139,'monthly','2025-10-17 04:52:05',NULL,'2026-02-14 06:52:05','REC-DB',8.00,'percentage',0.00,'Database optimization','Net 30',1,NULL,'2026-01-15 08:52:05','2026-01-15 08:52:05'),(61,1,140,'monthly','2025-10-17 04:52:05',NULL,'2026-02-14 06:52:05','REC-DESIGN',8.00,'percentage',0.00,'Design services retainer','Net 30',1,NULL,'2026-01-15 08:52:05','2026-01-15 08:52:05'),(62,1,141,'monthly','2025-10-17 04:52:05',NULL,'2026-02-14 06:52:05','REC-CLOUD',8.00,'percentage',0.00,'Cloud infrastructure','Net 30',1,NULL,'2026-01-15 08:52:05','2026-01-15 08:52:05'),(63,1,142,'monthly','2025-10-17 04:52:05',NULL,'2026-02-14 06:52:05','REC-SEC',8.00,'percentage',0.00,'Security monitoring','Net 30',1,NULL,'2026-01-15 08:52:05','2026-01-15 08:52:05');
/*!40000 ALTER TABLE `recurringInvoices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reminderLogs`
--

DROP TABLE IF EXISTS `reminderLogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reminderLogs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `invoiceId` int NOT NULL,
  `userId` int NOT NULL,
  `sentAt` timestamp NOT NULL DEFAULT (now()),
  `daysOverdue` int NOT NULL,
  `recipientEmail` varchar(320) NOT NULL,
  `status` enum('sent','failed') NOT NULL,
  `errorMessage` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reminderLogs`
--

LOCK TABLES `reminderLogs` WRITE;
/*!40000 ALTER TABLE `reminderLogs` DISABLE KEYS */;
INSERT INTO `reminderLogs` VALUES (71,105,1,'2026-01-06 06:52:05',12,'client@example.com','sent',NULL),(72,109,1,'2025-12-27 06:52:05',12,'client@example.com','sent',NULL),(73,110,1,'2026-01-07 06:52:05',12,'client@example.com','sent',NULL),(74,107,1,'2026-01-06 06:52:05',7,'client@example.com','sent',NULL),(75,109,1,'2026-01-12 06:52:05',10,'client@example.com','sent',NULL),(76,106,1,'2026-01-05 06:52:05',3,'client@example.com','sent',NULL),(77,110,1,'2026-01-13 06:52:05',6,'client@example.com','sent',NULL),(78,108,1,'2025-12-30 06:52:05',2,'client@example.com','sent',NULL),(79,111,1,'2026-01-14 06:52:05',8,'client@example.com','sent',NULL),(80,108,1,'2026-01-07 06:52:05',8,'client@example.com','sent',NULL);
/*!40000 ALTER TABLE `reminderLogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reminderSettings`
--

DROP TABLE IF EXISTS `reminderSettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reminderSettings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `enabled` int NOT NULL DEFAULT '1',
  `intervals` text NOT NULL,
  `emailTemplate` text NOT NULL,
  `ccEmail` varchar(320) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `reminderSettings_userId_unique` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reminderSettings`
--

LOCK TABLES `reminderSettings` WRITE;
/*!40000 ALTER TABLE `reminderSettings` DISABLE KEYS */;
INSERT INTO `reminderSettings` VALUES (8,1,1,'[7,3,1]','Please find the attached invoice.',NULL,'2026-01-15 08:50:52','2026-01-15 08:50:52');
/*!40000 ALTER TABLE `reminderSettings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stripeWebhookEvents`
--

DROP TABLE IF EXISTS `stripeWebhookEvents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stripeWebhookEvents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `eventId` varchar(255) NOT NULL,
  `eventType` varchar(100) NOT NULL,
  `payload` text NOT NULL,
  `processed` int NOT NULL DEFAULT '0',
  `processedAt` timestamp NULL DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  UNIQUE KEY `stripeWebhookEvents_eventId_unique` (`eventId`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stripeWebhookEvents`
--

LOCK TABLES `stripeWebhookEvents` WRITE;
/*!40000 ALTER TABLE `stripeWebhookEvents` DISABLE KEYS */;
INSERT INTO `stripeWebhookEvents` VALUES (31,'evt_7pezucqd4t','payment_intent.succeeded','{\"id\":\"evt_7pezucqd4t\",\"type\":\"payment_intent.succeeded\"}',1,'2025-12-29 06:52:05','2026-01-15 08:52:05'),(32,'evt_n8e8duwfjxm','payment_intent.payment_failed','{\"id\":\"evt_n8e8duwfjxm\",\"type\":\"payment_intent.payment_failed\"}',1,'2025-12-24 06:52:05','2026-01-15 08:52:05'),(33,'evt_lqshqab1gmf','checkout.session.completed','{\"id\":\"evt_lqshqab1gmf\",\"type\":\"checkout.session.completed\"}',1,'2026-01-03 06:52:05','2026-01-15 08:52:05'),(34,'evt_y1zt2py2pbc','invoice.paid','{\"id\":\"evt_y1zt2py2pbc\",\"type\":\"invoice.paid\"}',1,'2025-12-17 06:52:05','2026-01-15 08:52:05'),(35,'evt_a4tobv5uevj','invoice.payment_failed','{\"id\":\"evt_a4tobv5uevj\",\"type\":\"invoice.payment_failed\"}',0,'2026-01-15 06:52:05','2026-01-15 08:52:05'),(36,'evt_b52va51bhb','payment_intent.succeeded','{\"id\":\"evt_b52va51bhb\",\"type\":\"payment_intent.succeeded\"}',1,'2026-01-06 06:52:05','2026-01-15 08:52:05');
/*!40000 ALTER TABLE `stripeWebhookEvents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usageTracking`
--

DROP TABLE IF EXISTS `usageTracking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usageTracking` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `month` varchar(7) NOT NULL,
  `invoicesCreated` int NOT NULL DEFAULT '0',
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_month_idx` (`userId`,`month`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usageTracking`
--

LOCK TABLES `usageTracking` WRITE;
/*!40000 ALTER TABLE `usageTracking` DISABLE KEYS */;
INSERT INTO `usageTracking` VALUES (19,1,'2025-12',9,'2026-01-15 08:52:05','2026-01-15 08:52:05'),(20,1,'2026-01',18,'2026-01-15 08:52:05','2026-01-15 08:52:05'),(21,1,'2026-02',16,'2026-01-15 08:52:05','2026-01-15 08:52:05');
/*!40000 ALTER TABLE `usageTracking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `openId` varchar(64) NOT NULL,
  `name` text,
  `email` varchar(320) DEFAULT NULL,
  `loginMethod` varchar(64) DEFAULT NULL,
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  `lastSignedIn` timestamp NOT NULL DEFAULT (now()),
  `companyName` text,
  `companyAddress` text,
  `companyPhone` varchar(50) DEFAULT NULL,
  `logoUrl` text,
  `stripeCustomerId` varchar(255) DEFAULT NULL,
  `subscriptionStatus` enum('free','active','canceled','past_due') NOT NULL DEFAULT 'free',
  `subscriptionId` varchar(255) DEFAULT NULL,
  `currentPeriodEnd` timestamp NULL DEFAULT NULL,
  `baseCurrency` varchar(3) NOT NULL DEFAULT 'USD',
  `avatarUrl` text,
  `avatarType` enum('initials','boring','upload') DEFAULT 'initials',
  `taxId` varchar(50) DEFAULT NULL,
  `defaultInvoiceStyle` enum('receipt','classic') DEFAULT 'receipt',
  `subscriptionEndDate` timestamp NULL DEFAULT NULL,
  `subscriptionSource` enum('stripe','crypto') DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_openId_unique` (`openId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'dev-user-local','Local Dev User','dev@localhost.test','dev','admin','2026-01-15 08:14:24','2026-01-15 08:23:16','2026-01-15 08:14:24',NULL,NULL,NULL,NULL,NULL,'active','premium_dev_123','2027-01-15 08:23:16','USD',NULL,'initials',NULL,'receipt',NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userWallets`
--

DROP TABLE IF EXISTS `userWallets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userWallets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `label` varchar(100) NOT NULL,
  `address` varchar(255) NOT NULL,
  `network` enum('ethereum','polygon','bitcoin','bsc','arbitrum','optimism') NOT NULL,
  `sortOrder` int NOT NULL DEFAULT '0',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_userId` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userWallets`
--

LOCK TABLES `userWallets` WRITE;
/*!40000 ALTER TABLE `userWallets` DISABLE KEYS */;
/*!40000 ALTER TABLE `userWallets` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-20 21:58:53
