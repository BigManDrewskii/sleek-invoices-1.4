import mysql from "mysql2/promise";

const DATABASE_URL =
  "mysql://sleekinvoices:localdev123@localhost:3306/sleekinvoices_dev";
const url = new URL(DATABASE_URL);

async function createMissingTables() {
  const connection = await mysql.createConnection({
    host: url.hostname || "localhost",
    port: parseInt(url.port) || 3306,
    user: url.username,
    password: url.password,
    database: url.pathname.slice(1),
  });

  console.log("Creating missing tables...\n");

  try {
    // 1. aiCreditPurchases
    console.log("Creating aiCreditPurchases...");
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS aiCreditPurchases (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        stripeSessionId VARCHAR(255) NOT NULL UNIQUE,
        stripePaymentIntentId VARCHAR(255),
        packType ENUM('starter', 'standard', 'pro_pack') NOT NULL,
        creditsAmount INT NOT NULL,
        amountPaid INT NOT NULL,
        currency VARCHAR(3) DEFAULT 'usd' NOT NULL,
        status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending' NOT NULL,
        appliedToMonth VARCHAR(7),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        completedAt TIMESTAMP NULL
      )
    `);
    console.log("  ✓ aiCreditPurchases created\n");

    // 2. aiUsageLogs
    console.log("Creating aiUsageLogs...");
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS aiUsageLogs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        feature ENUM('smart_compose', 'categorization', 'prediction', 'ai_assistant') NOT NULL,
        inputTokens INT DEFAULT 0 NOT NULL,
        outputTokens INT DEFAULT 0 NOT NULL,
        model VARCHAR(100) NOT NULL,
        success BOOLEAN DEFAULT TRUE NOT NULL,
        errorMessage TEXT,
        latencyMs INT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    console.log("  ✓ aiUsageLogs created\n");

    // 3. auditLog
    console.log("Creating auditLog...");
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS auditLog (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        action VARCHAR(50) NOT NULL,
        entityType VARCHAR(50) NOT NULL,
        entityId INT,
        entityName VARCHAR(255),
        details TEXT,
        ipAddress VARCHAR(45),
        userAgent VARCHAR(500),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    console.log("  ✓ auditLog created\n");

    // 4. batchInvoiceTemplates
    console.log("Creating batchInvoiceTemplates...");
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS batchInvoiceTemplates (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        dueInDays INT DEFAULT 30 NOT NULL,
        currency VARCHAR(10) DEFAULT 'USD' NOT NULL,
        taxRate DECIMAL(5,2) DEFAULT 0 NOT NULL,
        invoiceTemplateId INT,
        notes TEXT,
        paymentTerms TEXT,
        frequency ENUM('one-time', 'weekly', 'monthly', 'quarterly', 'yearly') DEFAULT 'monthly' NOT NULL,
        usageCount INT DEFAULT 0 NOT NULL,
        lastUsedAt TIMESTAMP NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
      )
    `);
    console.log("  ✓ batchInvoiceTemplates created\n");

    // 5. batchInvoiceTemplateLineItems
    console.log("Creating batchInvoiceTemplateLineItems...");
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS batchInvoiceTemplateLineItems (
        id INT AUTO_INCREMENT PRIMARY KEY,
        templateId INT NOT NULL,
        description TEXT NOT NULL,
        quantity DECIMAL(24,8) NOT NULL,
        rate DECIMAL(24,8) NOT NULL,
        sortOrder INT DEFAULT 0 NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    console.log("  ✓ batchInvoiceTemplateLineItems created\n");

    // 6. cryptoSubscriptionPayments
    console.log("Creating cryptoSubscriptionPayments...");
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS cryptoSubscriptionPayments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        paymentId VARCHAR(255) NOT NULL UNIQUE,
        paymentStatus VARCHAR(50) NOT NULL,
        priceAmount DECIMAL(10,2) NOT NULL,
        priceCurrency VARCHAR(10) NOT NULL,
        payCurrency VARCHAR(10) NOT NULL,
        payAmount DECIMAL(24,8) NOT NULL,
        months INT DEFAULT 1 NOT NULL,
        isExtension BOOLEAN DEFAULT FALSE NOT NULL,
        confirmedAt TIMESTAMP NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log("  ✓ cryptoSubscriptionPayments created\n");

    // 7. customFields
    console.log("Creating customFields...");
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS customFields (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        templateId INT,
        fieldName VARCHAR(100) NOT NULL,
        fieldLabel VARCHAR(100) NOT NULL,
        fieldType ENUM('text', 'number', 'date', 'select') DEFAULT 'text' NOT NULL,
        isRequired BOOLEAN DEFAULT FALSE NOT NULL,
        defaultValue TEXT,
        selectOptions TEXT,
        sortOrder INT DEFAULT 0 NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
      )
    `);
    console.log("  ✓ customFields created\n");

    // 8. invoiceCustomFieldValues
    console.log("Creating invoiceCustomFieldValues...");
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS invoiceCustomFieldValues (
        id INT AUTO_INCREMENT PRIMARY KEY,
        invoiceId INT NOT NULL,
        customFieldId INT NOT NULL,
        value TEXT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    console.log("  ✓ invoiceCustomFieldValues created\n");

    // 9. paymentGateways
    console.log("Creating paymentGateways...");
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS paymentGateways (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        provider ENUM('stripe_connect', 'coinbase_commerce') NOT NULL,
        config TEXT NOT NULL,
        isEnabled BOOLEAN DEFAULT TRUE NOT NULL,
        displayName VARCHAR(100),
        lastTestedAt TIMESTAMP NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
        UNIQUE INDEX user_provider_idx (userId, provider)
      )
    `);
    console.log("  ✓ paymentGateways created\n");

    // 10. quickbooksPaymentMapping
    console.log("Creating quickbooksPaymentMapping...");
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS quickbooksPaymentMapping (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        paymentId INT NOT NULL,
        qbPaymentId VARCHAR(50) NOT NULL,
        qbInvoiceId VARCHAR(50),
        syncDirection ENUM('to_qb', 'from_qb') NOT NULL,
        syncVersion INT DEFAULT 1 NOT NULL,
        lastSyncedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        UNIQUE INDEX qb_payment_idx (userId, paymentId),
        UNIQUE INDEX qb_payment_qb_idx (userId, qbPaymentId)
      )
    `);
    console.log("  ✓ quickbooksPaymentMapping created\n");

    // 11. quickbooksSyncLog
    console.log("Creating quickbooksSyncLog...");
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS quickbooksSyncLog (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        entityType ENUM('customer', 'invoice', 'payment') NOT NULL,
        entityId INT NOT NULL,
        qbEntityId VARCHAR(50),
        action ENUM('create', 'update', 'delete') NOT NULL,
        status ENUM('success', 'failed', 'pending') NOT NULL,
        errorMessage TEXT,
        requestPayload TEXT,
        responsePayload TEXT,
        syncedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    console.log("  ✓ quickbooksSyncLog created\n");

    // 12. userWallets
    console.log("Creating userWallets...");
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS userWallets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        label VARCHAR(100) NOT NULL,
        address VARCHAR(255) NOT NULL,
        network ENUM('ethereum', 'polygon', 'bitcoin', 'bsc', 'arbitrum', 'optimism') NOT NULL,
        sortOrder INT DEFAULT 0 NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
      )
    `);
    console.log("  ✓ userWallets created\n");

    console.log("=".repeat(60));
    console.log("\n✅ All 12 missing tables created successfully!\n");
  } catch (error) {
    console.log("Error:", error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

createMissingTables().catch(console.error);
