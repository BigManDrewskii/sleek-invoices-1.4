import mysql from "mysql2/promise";

const DATABASE_URL =
  "mysql://sleekinvoices:localdev123@localhost:3306/sleekinvoices_dev";
const url = new URL(DATABASE_URL);

async function createTables(connection) {
  console.log("📦 Creating missing tables...\n");

  const tables = [
    // Client Contacts
    `CREATE TABLE IF NOT EXISTS clientContacts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      clientId INT NOT NULL,
      firstName VARCHAR(100),
      lastName VARCHAR(100),
      email VARCHAR(255),
      phone VARCHAR(50),
      role VARCHAR(100),
      isPrimary BOOLEAN DEFAULT FALSE,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
      INDEX idx_clientId (clientId)
    )`,

    // Custom Fields
    `CREATE TABLE IF NOT EXISTS customFields (
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
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
      INDEX idx_userId (userId),
      INDEX idx_templateId (templateId)
    )`,

    // Invoice Custom Field Values
    `CREATE TABLE IF NOT EXISTS invoiceCustomFieldValues (
      id INT AUTO_INCREMENT PRIMARY KEY,
      invoiceId INT NOT NULL,
      customFieldId INT NOT NULL,
      value TEXT NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      INDEX idx_invoiceId (invoiceId),
      INDEX idx_customFieldId (customFieldId)
    )`,

    // Products
    `CREATE TABLE IF NOT EXISTS products (
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
    )`,

    // Estimates
    `CREATE TABLE IF NOT EXISTS estimates (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT NOT NULL,
      clientId INT NOT NULL,
      estimateNumber VARCHAR(50) NOT NULL,
      status ENUM('draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired', 'converted') DEFAULT 'draft' NOT NULL,
      currency VARCHAR(10) DEFAULT 'USD' NOT NULL,
      subtotal DECIMAL(24,8) NOT NULL,
      taxRate DECIMAL(5,2) DEFAULT '0' NOT NULL,
      taxAmount DECIMAL(24,8) DEFAULT '0' NOT NULL,
      discountType ENUM('percentage', 'fixed') DEFAULT 'percentage',
      discountValue DECIMAL(24,8) DEFAULT '0' NOT NULL,
      discountAmount DECIMAL(24,8) DEFAULT '0' NOT NULL,
      total DECIMAL(24,8) NOT NULL,
      title VARCHAR(255),
      notes TEXT,
      terms TEXT,
      templateId INT,
      issueDate TIMESTAMP NOT NULL,
      validUntil TIMESTAMP NOT NULL,
      sentAt TIMESTAMP,
      viewedAt TIMESTAMP,
      acceptedAt TIMESTAMP,
      rejectedAt TIMESTAMP,
      convertedToInvoiceId INT,
      convertedAt TIMESTAMP,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
      INDEX idx_userId (userId),
      INDEX idx_clientId (clientId)
    )`,

    // Estimate Line Items
    `CREATE TABLE IF NOT EXISTS estimateLineItems (
      id INT AUTO_INCREMENT PRIMARY KEY,
      estimateId INT NOT NULL,
      description TEXT NOT NULL,
      quantity DECIMAL(24,8) NOT NULL,
      rate DECIMAL(24,8) NOT NULL,
      amount DECIMAL(24,8) NOT NULL,
      sortOrder INT DEFAULT 0 NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      INDEX idx_estimateId (estimateId)
    )`,

    // AI Credit Purchases
    `CREATE TABLE IF NOT EXISTS aiCreditPurchases (
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
      completedAt TIMESTAMP,
      INDEX idx_userId (userId)
    )`,

    // AI Usage Logs
    `CREATE TABLE IF NOT EXISTS aiUsageLogs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT NOT NULL,
      feature ENUM('smart_compose', 'categorization', 'prediction', 'ai_assistant') NOT NULL,
      inputTokens INT DEFAULT 0 NOT NULL,
      outputTokens INT DEFAULT 0 NOT NULL,
      model VARCHAR(100) NOT NULL,
      success BOOLEAN DEFAULT TRUE NOT NULL,
      errorMessage TEXT,
      latencyMs INT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      INDEX idx_userId (userId),
      INDEX idx_feature (feature)
    )`,

    // Payment Gateways
    `CREATE TABLE IF NOT EXISTS paymentGateways (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT NOT NULL,
      provider ENUM('stripe_connect', 'coinbase_commerce') NOT NULL,
      config TEXT NOT NULL,
      isEnabled BOOLEAN DEFAULT TRUE NOT NULL,
      displayName VARCHAR(100),
      lastTestedAt TIMESTAMP,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
      UNIQUE INDEX user_provider_idx (userId, provider)
    )`,

    // User Wallets
    `CREATE TABLE IF NOT EXISTS userWallets (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT NOT NULL,
      label VARCHAR(100) NOT NULL,
      address VARCHAR(255) NOT NULL,
      network ENUM('ethereum', 'polygon', 'bitcoin', 'bsc', 'arbitrum', 'optimism') NOT NULL,
      sortOrder INT DEFAULT 0 NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
      INDEX idx_userId (userId)
    )`,

    // Invoice Views
    `CREATE TABLE IF NOT EXISTS invoiceViews (
      id INT AUTO_INCREMENT PRIMARY KEY,
      invoiceId INT NOT NULL,
      viewedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      ipAddress VARCHAR(45),
      userAgent TEXT,
      isFirstView BOOLEAN DEFAULT FALSE NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      INDEX idx_invoiceId (invoiceId)
    )`,

    // Crypto Subscription Payments
    `CREATE TABLE IF NOT EXISTS cryptoSubscriptionPayments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT NOT NULL,
      paymentId VARCHAR(255) NOT NULL UNIQUE,
      paymentStatus VARCHAR(50) NOT NULL,
      priceAmount DECIMAL(10,2) NOT NULL,
      priceCurrency VARCHAR(10) NOT NULL,
      payCurrency VARCHAR(10) NOT NULL,
      payAmount DECIMAL(24,8) NOT NULL,
      months INT NOT NULL DEFAULT 1,
      isExtension BOOLEAN NOT NULL DEFAULT FALSE,
      confirmedAt TIMESTAMP,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_userId (userId)
    )`,

    // QuickBooks Connections
    `CREATE TABLE IF NOT EXISTS quickbooksConnections (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT NOT NULL UNIQUE,
      realmId VARCHAR(50) NOT NULL,
      companyName VARCHAR(255),
      accessToken TEXT NOT NULL,
      refreshToken TEXT NOT NULL,
      tokenExpiresAt TIMESTAMP NOT NULL,
      refreshTokenExpiresAt TIMESTAMP NOT NULL,
      isActive BOOLEAN DEFAULT TRUE NOT NULL,
      environment ENUM('sandbox', 'production') DEFAULT 'sandbox' NOT NULL,
      lastSyncAt TIMESTAMP,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
    )`,

    // QuickBooks Customer Mapping
    `CREATE TABLE IF NOT EXISTS quickbooksCustomerMapping (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT NOT NULL,
      clientId INT NOT NULL,
      qbCustomerId VARCHAR(50) NOT NULL,
      qbDisplayName VARCHAR(255),
      syncVersion INT DEFAULT 1 NOT NULL,
      lastSyncedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      UNIQUE INDEX qb_customer_client_idx (userId, clientId)
    )`,

    // QuickBooks Sync Log
    `CREATE TABLE IF NOT EXISTS quickbooksSyncLog (
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
      syncedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      INDEX idx_userId (userId)
    )`,

    // QuickBooks Sync Settings
    `CREATE TABLE IF NOT EXISTS quickbooksSyncSettings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT NOT NULL UNIQUE,
      autoSyncInvoices BOOLEAN DEFAULT TRUE NOT NULL,
      autoSyncPayments BOOLEAN DEFAULT TRUE NOT NULL,
      syncPaymentsFromQB BOOLEAN DEFAULT TRUE NOT NULL,
      minInvoiceAmount DECIMAL(24,8),
      syncDraftInvoices BOOLEAN DEFAULT FALSE NOT NULL,
      lastPaymentPollAt TIMESTAMP,
      pollIntervalMinutes INT DEFAULT 60 NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
    )`,

    // Client Tags
    `CREATE TABLE IF NOT EXISTS clientTags (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT NOT NULL,
      name VARCHAR(50) NOT NULL,
      color VARCHAR(7) DEFAULT '#6366f1' NOT NULL,
      description TEXT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
      UNIQUE INDEX client_tag_user_idx (userId, name)
    )`,

    // Client Tag Assignments
    `CREATE TABLE IF NOT EXISTS clientTagAssignments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      clientId INT NOT NULL,
      tagId INT NOT NULL,
      assignedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      UNIQUE INDEX client_tag_assignment_idx (clientId, tagId)
    )`,

    // Batch Invoice Templates
    `CREATE TABLE IF NOT EXISTS batchInvoiceTemplates (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT NOT NULL,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      dueInDays INT DEFAULT 30 NOT NULL,
      currency VARCHAR(10) DEFAULT 'USD' NOT NULL,
      taxRate DECIMAL(5,2) DEFAULT '0' NOT NULL,
      invoiceTemplateId INT,
      notes TEXT,
      paymentTerms TEXT,
      frequency ENUM('one-time', 'weekly', 'monthly', 'quarterly', 'yearly') DEFAULT 'monthly' NOT NULL,
      usageCount INT DEFAULT 0 NOT NULL,
      lastUsedAt TIMESTAMP,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
      INDEX idx_userId (userId)
    )`,

    // Batch Invoice Template Line Items
    `CREATE TABLE IF NOT EXISTS batchInvoiceTemplateLineItems (
      id INT AUTO_INCREMENT PRIMARY KEY,
      templateId INT NOT NULL,
      description TEXT NOT NULL,
      quantity DECIMAL(24,8) NOT NULL,
      rate DECIMAL(24,8) NOT NULL,
      sortOrder INT DEFAULT 0 NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      INDEX idx_templateId (templateId)
    )`,

    // Audit Log
    `CREATE TABLE IF NOT EXISTS auditLog (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT NOT NULL,
      action VARCHAR(50) NOT NULL,
      entityType VARCHAR(50) NOT NULL,
      entityId INT,
      entityName VARCHAR(255),
      details TEXT,
      ipAddress VARCHAR(45),
      userAgent VARCHAR(500),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      INDEX idx_userId (userId),
      INDEX idx_entity (entityType, entityId)
    )`,
  ];

  for (const tableSQL of tables) {
    const tableName = tableSQL.match(/CREATE TABLE IF NOT EXISTS (\w+)/)?.[1];
    try {
      await connection.execute(tableSQL);
      console.log(`  ✓ ${tableName}`);
    } catch (error) {
      console.log(`  ✗ ${tableName}: ${error.message}`);
    }
  }
  console.log();
}

async function seedDatabase() {
  const connection = await mysql.createConnection({
    host: url.hostname || "localhost",
    port: parseInt(url.port) || 3306,
    user: url.username,
    password: url.password,
    database: url.pathname.slice(1),
  });

  console.log("🌱 Starting comprehensive database seed...\n");

  try {
    // Create missing tables first
    await createTables(connection);

    console.log("Clearing existing test data...");
    const deleteTables = [
      "invoiceLineItems",
      "payments",
      "expenses",
      "invoiceGenerationLogs",
      "emailLog",
      "reminderLogs",
      "usageTracking",
      "stripeWebhookEvents",
      "clientPortalAccess",
      "recurringInvoiceLineItems",
      "quickbooksInvoiceMapping",
      "quickbooksPaymentMapping",
      "aiUsageLogs",
      "invoiceViews",
    ];
    for (const table of deleteTables) {
      try {
        await connection.execute(`DELETE FROM ${table} WHERE id > 0`);
      } catch (e) {
        // Table might not exist
      }
    }
    await connection.execute("DELETE FROM invoices WHERE userId = 1");
    await connection.execute("DELETE FROM recurringInvoices WHERE userId = 1");
    await connection.execute("DELETE FROM clients WHERE userId = 1");
    console.log("✓ Cleared existing data\n");

    const userId = 1;
    const now = new Date();

    function daysAgo(days) {
      const d = new Date(now);
      d.setDate(d.getDate() - days);
      return d.toISOString().slice(0, 19).replace("T", " ");
    }

    function daysFromNow(days) {
      const d = new Date(now);
      d.setDate(d.getDate() + days);
      return d.toISOString().slice(0, 19).replace("T", " ");
    }

    function monthsAgo(months) {
      const d = new Date(now);
      d.setMonth(d.getMonth() - months);
      return d.toISOString().slice(0, 7); // YYYY-MM
    }

    // 1. SEED CLIENTS
    console.log("📋 Seeding clients...");
    const clients = [
      {
        name: "Acme Corporation",
        email: "billing@acme.com",
        companyName: "Acme Corp",
        address: "123 Industrial Way, San Francisco, CA 94102",
        phone: "+1 (415) 555-0100",
        vatNumber: "US123456789",
      },
      {
        name: "TechStart Inc",
        email: "accounts@techstart.io",
        companyName: "TechStart",
        address: "456 Innovation Blvd, Austin, TX 78701",
        phone: "+1 (512) 555-0200",
        vatNumber: "US987654321",
      },
      {
        name: "Global Ventures",
        email: "finance@globalventures.com",
        companyName: "Global Ventures LLC",
        address: "789 Commerce St, New York, NY 10001",
        phone: "+1 (212) 555-0300",
        vatNumber: "US456789123",
      },
      {
        name: "Creative Agency",
        email: "hello@creativeagency.co",
        companyName: "Creative Agency Inc",
        address: "321 Design Ave, Los Angeles, CA 90001",
        phone: "+1 (310) 555-0400",
        vatNumber: "US321654987",
      },
      {
        name: "DataFlow Systems",
        email: "ap@dataflow.systems",
        companyName: "DataFlow Systems Corp",
        address: "555 Server Lane, Seattle, WA 98101",
        phone: "+1 (206) 555-0500",
        vatNumber: "US654321789",
      },
      {
        name: "Summit Partners",
        email: "payments@summitpartners.net",
        companyName: "Summit Partners LLC",
        address: "999 Mountain View, Denver, CO 80202",
        phone: "+1 (303) 555-0600",
        vatNumber: "US789123456",
      },
      {
        name: "Oceanic Trading Co",
        email: "finance@oceanictrading.com",
        companyName: "Oceanic Trading Company",
        address: "888 Harbor Dr, Miami, FL 33101",
        phone: "+1 (305) 555-0700",
        vatNumber: "US147258369",
      },
      {
        name: "Pinnacle Consulting",
        email: "billing@pinnacleconsult.net",
        companyName: "Pinnacle Consulting Group",
        address: "777 Executive Plaza, Chicago, IL 60601",
        phone: "+1 (312) 555-0800",
        vatNumber: "US258369147",
      },
    ];

    const clientIds = [];
    for (const client of clients) {
      const [result] = await connection.execute(
        `INSERT INTO clients (userId, name, email, companyName, address, phone, vatNumber, taxExempt, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, false, NOW(), NOW())`,
        [
          userId,
          client.name,
          client.email,
          client.companyName,
          client.address,
          client.phone,
          client.vatNumber,
        ]
      );
      clientIds.push(result.insertId);
    }
    console.log(`  ✓ Created ${clients.length} clients\n`);

    // 2. SEED CLIENT CONTACTS
    console.log("👥 Seeding client contacts...");
    const contacts = [
      {
        clientIdx: 0,
        firstName: "John",
        lastName: "Smith",
        email: "john.smith@acme.com",
        role: "Finance Manager",
      },
      {
        clientIdx: 1,
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah.j@techstart.io",
        role: "CEO",
      },
      {
        clientIdx: 2,
        firstName: "Michael",
        lastName: "Chen",
        email: "mchen@globalventures.com",
        role: "Controller",
      },
      {
        clientIdx: 3,
        firstName: "Emily",
        lastName: "Davis",
        email: "emily@creativeagency.co",
        role: "Creative Director",
      },
    ];
    for (const contact of contacts) {
      await connection.execute(
        `INSERT INTO clientContacts (clientId, firstName, lastName, email, role, isPrimary, createdAt) VALUES (?, ?, ?, ?, ?, true, NOW())`,
        [
          clientIds[contact.clientIdx],
          contact.firstName,
          contact.lastName,
          contact.email,
          contact.role,
        ]
      );
    }
    console.log(`  ✓ Created ${contacts.length} client contacts\n`);

    // 3. SEED CLIENT TAGS
    console.log("🏷️  Seeding client tags...");
    const tags = [
      { name: "VIP", color: "#f59e0b", description: "High-value clients" },
      {
        name: "Recurring",
        color: "#10b981",
        description: "Recurring business",
      },
      {
        name: "Enterprise",
        color: "#6366f1",
        description: "Enterprise accounts",
      },
      { name: "New", color: "#3b82f6", description: "New clients" },
    ];
    const tagIds = [];
    for (const tag of tags) {
      const [result] = await connection.execute(
        `INSERT INTO clientTags (userId, name, color, description, createdAt) VALUES (?, ?, ?, ?, NOW()) ON DUPLICATE KEY UPDATE color = VALUES(color), description = VALUES(description)`,
        [userId, tag.name, tag.color, tag.description]
      );
      // Get the existing ID if it was an update
      if (result.insertId === 0) {
        const [rows] = await connection.execute(
          `SELECT id FROM clientTags WHERE userId = ? AND name = ?`,
          [userId, tag.name]
        );
        if (rows.length > 0) tagIds.push(rows[0].id);
      } else {
        tagIds.push(result.insertId);
      }
    }
    // Clear and reassign tags to clients
    await connection.execute(
      `DELETE FROM clientTagAssignments WHERE clientId IN (${clientIds.join(",")})`
    );
    await connection.execute(
      `INSERT INTO clientTagAssignments (clientId, tagId, assignedAt) VALUES (?, ?, NOW())`,
      [clientIds[0], tagIds[0]]
    );
    await connection.execute(
      `INSERT INTO clientTagAssignments (clientId, tagId, assignedAt) VALUES (?, ?, NOW())`,
      [clientIds[1], tagIds[1]]
    );
    await connection.execute(
      `INSERT INTO clientTagAssignments (clientId, tagId, assignedAt) VALUES (?, ?, NOW())`,
      [clientIds[2], tagIds[2]]
    );
    console.log(`  ✓ Created ${tags.length} tags and assigned to clients\n`);

    // 4. SEED INVOICE TEMPLATES
    console.log("🎨 Seeding invoice templates...");
    const templates = [
      {
        name: "Professional Dark",
        primaryColor: "#0f172a",
        secondaryColor: "#1e293b",
        accentColor: "#3b82f6",
        templateType: "professional",
      },
      {
        name: "Classic Blue",
        primaryColor: "#1e40af",
        secondaryColor: "#3b82f6",
        accentColor: "#60a5fa",
        templateType: "classic",
      },
      {
        name: "Modern Green",
        primaryColor: "#059669",
        secondaryColor: "#10b981",
        accentColor: "#34d399",
        templateType: "modern",
      },
      {
        name: "Bold Red",
        primaryColor: "#dc2626",
        secondaryColor: "#ef4444",
        accentColor: "#f87171",
        templateType: "bold",
      },
      {
        name: "Elegant Purple",
        primaryColor: "#7c3aed",
        secondaryColor: "#8b5cf6",
        accentColor: "#a78bfa",
        templateType: "creative",
      },
      {
        name: "Tech Cyan",
        primaryColor: "#0284c7",
        secondaryColor: "#0ea5e9",
        accentColor: "#38bdf8",
        templateType: "minimal",
      },
    ];
    const templateIds = [];
    for (const template of templates) {
      const [result] = await connection.execute(
        `INSERT INTO invoiceTemplates (userId, name, primaryColor, secondaryColor, accentColor, templateType, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          userId,
          template.name,
          template.primaryColor,
          template.secondaryColor,
          template.accentColor,
          template.templateType,
        ]
      );
      templateIds.push(result.insertId);
    }
    console.log(`  ✓ Created ${templates.length} invoice templates\n`);

    // 5. SEED PRODUCTS
    console.log("📦 Seeding products...");
    const products = [
      {
        name: "Web Development Hourly",
        description: "Frontend and backend web development services",
        rate: 150,
        unit: "hour",
        category: "Development",
      },
      {
        name: "Mobile App Development",
        description: "iOS and Android application development",
        rate: 175,
        unit: "hour",
        category: "Development",
      },
      {
        name: "UI/UX Design",
        description: "User interface and experience design services",
        rate: 125,
        unit: "hour",
        category: "Design",
      },
      {
        name: "Database Optimization",
        description: "Performance tuning and optimization",
        rate: 200,
        unit: "hour",
        category: "Development",
      },
      {
        name: "API Integration",
        description: "Third-party API integration services",
        rate: 140,
        unit: "hour",
        category: "Development",
      },
      {
        name: "Security Audit",
        description: "Comprehensive security assessment",
        rate: 250,
        unit: "hour",
        category: "Consulting",
      },
      {
        name: "Cloud Setup",
        description: "AWS/GCP cloud infrastructure setup",
        rate: 180,
        unit: "hour",
        category: "DevOps",
      },
      {
        name: "Monthly Maintenance",
        description: "Ongoing maintenance and support",
        rate: 500,
        unit: "month",
        category: "Support",
      },
    ];
    for (const product of products) {
      await connection.execute(
        `INSERT INTO products (userId, name, description, rate, unit, category, taxable, isActive, usageCount, createdAt) VALUES (?, ?, ?, ?, ?, ?, true, true, ?, NOW())`,
        [
          userId,
          product.name,
          product.description,
          product.rate,
          product.unit,
          product.category,
          Math.floor(Math.random() * 20),
        ]
      );
    }
    console.log(`  ✓ Created ${products.length} products\n`);

    // 6. SEED INVOICES
    console.log("📄 Seeding invoices...");
    const invoices = [
      {
        clientIdx: 0,
        invoiceNumber: "INV-2026-001",
        status: "paid",
        subtotal: 2500,
        taxRate: 8.5,
        total: 2712.5,
        issueDate: daysAgo(30),
        dueDate: daysAgo(0),
        templateIdx: 0,
      },
      {
        clientIdx: 1,
        invoiceNumber: "INV-2026-002",
        status: "sent",
        subtotal: 1800,
        taxRate: 0,
        total: 1800,
        issueDate: daysAgo(15),
        dueDate: daysFromNow(15),
        templateIdx: 1,
      },
      {
        clientIdx: 2,
        invoiceNumber: "INV-2026-003",
        status: "overdue",
        subtotal: 3200,
        taxRate: 10,
        total: 3520,
        issueDate: daysAgo(45),
        dueDate: daysAgo(15),
        templateIdx: 2,
      },
      {
        clientIdx: 3,
        invoiceNumber: "INV-2026-004",
        status: "draft",
        subtotal: 950,
        taxRate: 5,
        total: 997.5,
        issueDate: daysAgo(1),
        dueDate: daysFromNow(29),
        templateIdx: 0,
      },
      {
        clientIdx: 4,
        invoiceNumber: "INV-2026-005",
        status: "paid",
        subtotal: 5400,
        taxRate: 8.25,
        total: 5845.5,
        issueDate: daysAgo(60),
        dueDate: daysAgo(30),
        templateIdx: 3,
      },
      {
        clientIdx: 5,
        invoiceNumber: "INV-2026-006",
        status: "sent",
        subtotal: 1200,
        taxRate: 0,
        total: 1200,
        issueDate: daysAgo(10),
        dueDate: daysFromNow(20),
        templateIdx: 4,
      },
      {
        clientIdx: 6,
        invoiceNumber: "INV-2026-007",
        status: "draft",
        subtotal: 3750,
        taxRate: 7,
        total: 4012.5,
        issueDate: daysAgo(2),
        dueDate: daysFromNow(28),
        templateIdx: 5,
      },
      {
        clientIdx: 7,
        invoiceNumber: "INV-2026-008",
        status: "paid",
        subtotal: 2100,
        taxRate: 6,
        total: 2226,
        issueDate: daysAgo(20),
        dueDate: daysAgo(10),
        templateIdx: 1,
      },
    ];
    const invoiceIds = [];
    for (const inv of invoices) {
      const taxAmount = (inv.subtotal * inv.taxRate) / 100;
      const [result] = await connection.execute(
        `INSERT INTO invoices (userId, clientId, invoiceNumber, status, currency, subtotal, taxRate, taxAmount, total, amountPaid, issueDate, dueDate, templateId, notes, paymentTerms, createdAt, updatedAt) VALUES (?, ?, ?, ?, 'USD', ?, ?, ?, ?, ?, ?, ?, ?, 'Payment due within 30 days', 'Net 30', NOW(), NOW())`,
        [
          userId,
          clientIds[inv.clientIdx],
          inv.invoiceNumber,
          inv.status,
          inv.subtotal,
          inv.taxRate,
          taxAmount.toFixed(2),
          inv.total,
          inv.status === "paid" ? inv.total : "0.00",
          inv.issueDate,
          inv.dueDate,
          templateIds[inv.templateIdx],
        ]
      );
      invoiceIds.push(result.insertId);
    }
    console.log(`  ✓ Created ${invoices.length} invoices\n`);

    // 7. SEED INVOICE LINE ITEMS
    console.log("📝 Seeding invoice line items...");
    const lineItemDescriptions = [
      "Web Development Services - Frontend implementation",
      "Mobile App Development - iOS application",
      "Database Design and Optimization",
      "API Integration and Testing",
      "UI/UX Design Consultation",
      "Cloud Infrastructure Setup",
      "Security Audit and Hardening",
      "Performance Optimization",
      "Technical Documentation",
      "Monthly Maintenance Retainer",
    ];
    let totalLineItems = 0;
    for (const invoiceId of invoiceIds) {
      const numItems = Math.floor(Math.random() * 3) + 2;
      for (let i = 0; i < numItems; i++) {
        const quantity = Math.floor(Math.random() * 20) + 1;
        const rate = (Math.floor(Math.random() * 200) + 50) * 5;
        const amount = quantity * rate;
        const desc =
          lineItemDescriptions[
            Math.floor(Math.random() * lineItemDescriptions.length)
          ];
        await connection.execute(
          `INSERT INTO invoiceLineItems (invoiceId, description, quantity, rate, amount, sortOrder, createdAt) VALUES (?, ?, ?, ?, ?, ?, NOW())`,
          [invoiceId, desc, quantity, rate, amount, i]
        );
        totalLineItems++;
      }
    }
    console.log(`  ✓ Created ${totalLineItems} invoice line items\n`);

    // 8. SEED INVOICE VIEWS
    console.log("👁️  Seeding invoice views...");
    for (const invoiceId of invoiceIds.slice(0, 5)) {
      await connection.execute(
        `INSERT INTO invoiceViews (invoiceId, viewedAt, ipAddress, isFirstView, createdAt) VALUES (?, ?, '192.168.1.100', true, NOW())`,
        [invoiceId, daysAgo(Math.floor(Math.random() * 20) + 1)]
      );
    }
    console.log(`  ✓ Created invoice views\n`);

    // 9. SEED PAYMENTS
    console.log("💰 Seeding payments...");
    const payments = [
      { invoiceIdx: 0, amount: 2712.5, status: "completed", method: "stripe" },
      {
        invoiceIdx: 4,
        amount: 5845.5,
        status: "completed",
        method: "bank_transfer",
      },
      { invoiceIdx: 7, amount: 2226, status: "completed", method: "stripe" },
    ];
    for (const payment of payments) {
      await connection.execute(
        `INSERT INTO payments (userId, invoiceId, amount, currency, paymentMethod, status, paymentDate, createdAt, updatedAt) VALUES (?, ?, ?, 'USD', ?, ?, NOW(), NOW(), NOW())`,
        [
          userId,
          invoiceIds[payment.invoiceIdx],
          payment.amount,
          payment.method,
          payment.status,
        ]
      );
    }
    console.log(`  ✓ Created ${payments.length} payments\n`);

    // 10. SEED EXPENSE CATEGORIES
    console.log("🏷️  Seeding expense categories...");
    const expenseCategories = [
      { name: "Software & Subscriptions", icon: "software", color: "#3b82f6" },
      { name: "Office Supplies", icon: "office", color: "#22c55e" },
      { name: "Travel & Transportation", icon: "travel", color: "#f59e0b" },
      { name: "Professional Services", icon: "professional", color: "#8b5cf6" },
      { name: "Marketing & Advertising", icon: "marketing", color: "#ec4899" },
      { name: "Utilities", icon: "utilities", color: "#06b6d4" },
      { name: "Equipment & Hardware", icon: "equipment", color: "#6366f1" },
      { name: "Meals & Entertainment", icon: "meals", color: "#f97316" },
    ];
    const categoryIds = [];
    for (const category of expenseCategories) {
      const [result] = await connection.execute(
        `INSERT INTO expenseCategories (userId, name, icon, color, createdAt) VALUES (?, ?, ?, ?, NOW())`,
        [userId, category.name, category.icon, category.color]
      );
      categoryIds.push(result.insertId);
    }
    console.log(`  ✓ Created ${expenseCategories.length} expense categories\n`);

    // 11. SEED EXPENSES
    console.log("💳 Seeding expenses...");
    const expenses = [
      {
        categoryIdx: 0,
        amount: 299.99,
        description: "GitHub Enterprise subscription",
        vendor: "GitHub Inc",
      },
      {
        categoryIdx: 0,
        amount: 49.99,
        description: "Slack Business+ subscription",
        vendor: "Slack Technologies",
      },
      {
        categoryIdx: 0,
        amount: 199.0,
        description: "JetBrains All Products Pack",
        vendor: "JetBrains",
      },
      {
        categoryIdx: 3,
        amount: 1500,
        description: "Legal consultation - contract review",
        vendor: "Smith & Associates",
      },
      {
        categoryIdx: 2,
        amount: 450,
        description: "Client meeting travel - NYC",
        vendor: "United Airlines",
      },
      {
        categoryIdx: 4,
        amount: 750,
        description: "Google Ads campaign - Q1",
        vendor: "Google Ads",
      },
      {
        categoryIdx: 6,
        amount: 1299,
        description: 'MacBook Pro 14" - development laptop',
        vendor: "Apple Store",
      },
      {
        categoryIdx: 7,
        amount: 125.5,
        description: "Team lunch meeting",
        vendor: "Blue Oak Grill",
      },
    ];
    for (const exp of expenses) {
      await connection.execute(
        `INSERT INTO expenses (userId, categoryId, amount, currency, date, vendor, description, paymentMethod, taxAmount, isRecurring, createdAt, updatedAt) VALUES (?, ?, ?, 'USD', ?, ?, ?, 'credit_card', 0, 0, NOW(), NOW())`,
        [
          userId,
          categoryIds[exp.categoryIdx],
          exp.amount,
          daysAgo(Math.floor(Math.random() * 60) + 1),
          exp.vendor,
          exp.description,
        ]
      );
    }
    console.log(`  ✓ Created ${expenses.length} expenses\n`);

    // 12. SEED RECURRING INVOICES
    console.log("🔄 Seeding recurring invoices...");
    const recurringInvoicesData = [
      {
        clientIdx: 0,
        prefix: "REC-WEB",
        frequency: "monthly",
        description: "Web development retainer",
      },
      {
        clientIdx: 1,
        prefix: "REC-MOBILE",
        frequency: "weekly",
        description: "Mobile app maintenance",
      },
      {
        clientIdx: 2,
        prefix: "REC-DB",
        frequency: "monthly",
        description: "Database optimization",
      },
      {
        clientIdx: 3,
        prefix: "REC-DESIGN",
        frequency: "monthly",
        description: "Design services retainer",
      },
      {
        clientIdx: 4,
        prefix: "REC-CLOUD",
        frequency: "monthly",
        description: "Cloud infrastructure",
      },
      {
        clientIdx: 5,
        prefix: "REC-SEC",
        frequency: "monthly",
        description: "Security monitoring",
      },
    ];
    const recurringIds = [];
    for (const ri of recurringInvoicesData) {
      const [result] = await connection.execute(
        `INSERT INTO recurringInvoices (userId, clientId, frequency, startDate, endDate, nextInvoiceDate, invoiceNumberPrefix, taxRate, discountType, discountValue, notes, paymentTerms, isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, '8.00', 'percentage', 0, ?, ?, true, NOW(), NOW())`,
        [
          userId,
          clientIds[ri.clientIdx],
          ri.frequency,
          daysAgo(90),
          null,
          daysFromNow(30),
          ri.prefix,
          ri.description,
          "Net 30",
        ]
      );
      recurringIds.push(result.insertId);
    }
    console.log(
      `  ✓ Created ${recurringInvoicesData.length} recurring invoices\n`
    );

    // 13. SEED RECURRING INVOICE LINE ITEMS
    console.log("📋 Seeding recurring invoice line items...");
    const recurringLineItems = [
      "Website maintenance and updates",
      "Bug fixes and security patches",
      "Performance optimization",
      "Analytics and reporting",
      "API maintenance and monitoring",
    ];
    let totalRecurringLineItems = 0;
    for (const recurringId of recurringIds) {
      const numItems = Math.floor(Math.random() * 3) + 2;
      for (let i = 0; i < numItems; i++) {
        const desc =
          recurringLineItems[
            Math.floor(Math.random() * recurringLineItems.length)
          ];
        const quantity = Math.floor(Math.random() * 10) + 5;
        const rate = (Math.floor(Math.random() * 50) + 20) * 5;
        await connection.execute(
          `INSERT INTO recurringInvoiceLineItems (recurringInvoiceId, description, quantity, rate, sortOrder, createdAt) VALUES (?, ?, ?, ?, ?, NOW())`,
          [recurringId, desc, quantity, rate, i]
        );
        totalRecurringLineItems++;
      }
    }
    console.log(
      `  ✓ Created ${totalRecurringLineItems} recurring invoice line items\n`
    );

    // 14. SEED ESTIMATES
    console.log("📝 Seeding estimates...");
    const estimates = [
      {
        clientIdx: 0,
        estimateNumber: "EST-2026-001",
        status: "accepted",
        subtotal: 5000,
        taxRate: 8.5,
        total: 5425,
        title: "Website Redesign Project",
      },
      {
        clientIdx: 1,
        estimateNumber: "EST-2026-002",
        status: "sent",
        subtotal: 3500,
        taxRate: 0,
        total: 3500,
        title: "Mobile App MVP",
      },
      {
        clientIdx: 2,
        estimateNumber: "EST-2026-003",
        status: "draft",
        subtotal: 8000,
        taxRate: 10,
        total: 8800,
        title: "Enterprise Integration",
      },
      {
        clientIdx: 3,
        estimateNumber: "EST-2026-004",
        status: "viewed",
        subtotal: 2200,
        taxRate: 5,
        total: 2310,
        title: "Brand Refresh",
      },
    ];
    const estimateIds = [];
    for (const est of estimates) {
      const taxAmount = (est.subtotal * est.taxRate) / 100;
      const [result] = await connection.execute(
        `INSERT INTO estimates (userId, clientId, estimateNumber, status, currency, subtotal, taxRate, taxAmount, total, title, issueDate, validUntil, createdAt, updatedAt) VALUES (?, ?, ?, ?, 'USD', ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          userId,
          clientIds[est.clientIdx],
          est.estimateNumber,
          est.status,
          est.subtotal,
          est.taxRate,
          taxAmount.toFixed(2),
          est.total,
          est.title,
          daysAgo(5),
          daysFromNow(25),
        ]
      );
      estimateIds.push(result.insertId);
    }
    console.log(`  ✓ Created ${estimates.length} estimates\n`);

    // 15. SEED ESTIMATE LINE ITEMS
    console.log("📋 Seeding estimate line items...");
    const estimateLineItemDescriptions = [
      "Discovery and Planning Phase",
      "Design and Prototyping",
      "Development and Implementation",
      "Testing and Quality Assurance",
      "Deployment and Launch",
    ];
    let totalEstimateLineItems = 0;
    for (const estimateId of estimateIds) {
      for (let i = 0; i < 4; i++) {
        const desc = estimateLineItemDescriptions[i];
        const quantity = Math.floor(Math.random() * 10) + 1;
        const rate = (Math.floor(Math.random() * 100) + 50) * 10;
        await connection.execute(
          `INSERT INTO estimateLineItems (estimateId, description, quantity, rate, amount, sortOrder, createdAt) VALUES (?, ?, ?, ?, ?, ?, NOW())`,
          [estimateId, desc, quantity, rate, quantity * rate, i]
        );
        totalEstimateLineItems++;
      }
    }
    console.log(`  ✓ Created ${totalEstimateLineItems} estimate line items\n`);

    // 16. SEED CLIENT PORTAL ACCESS
    console.log("🔐 Seeding client portal access...");
    for (let i = 0; i < 5; i++) {
      const accessToken = Buffer.from(
        `${clientIds[i]}-${Date.now()}-${Math.random().toString(36).slice(2)}`
      ).toString("base64url");
      await connection.execute(
        `INSERT INTO clientPortalAccess (clientId, accessToken, expiresAt, createdAt) VALUES (?, ?, ?, NOW())`,
        [clientIds[i], accessToken, daysFromNow(365)]
      );
    }
    console.log(`  ✓ Created client portal access tokens\n`);

    // 17. SEED EMAIL LOG
    console.log("📧 Seeding email log...");
    const emailTypes = ["invoice", "reminder", "receipt"];
    for (let i = 0; i < 8; i++) {
      const invoiceIdx = Math.floor(Math.random() * invoiceIds.length);
      const type = emailTypes[Math.floor(Math.random() * emailTypes.length)];
      await connection.execute(
        `INSERT INTO emailLog (userId, invoiceId, recipientEmail, subject, emailType, sentAt, success, errorMessage) VALUES (?, ?, ?, ?, ?, ?, 1, NULL)`,
        [
          userId,
          invoiceIds[invoiceIdx],
          "client@example.com",
          `Invoice notification - ${i + 1}`,
          type,
          daysAgo(Math.floor(Math.random() * 30)),
        ]
      );
    }
    console.log(`  ✓ Created email log entries\n`);

    // 18. SEED REMINDER SETTINGS
    console.log("⏰ Seeding reminder settings...");
    await connection.execute(
      `INSERT INTO reminderSettings (userId, enabled, intervals, emailTemplate, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW()) ON DUPLICATE KEY UPDATE enabled = VALUES(enabled), intervals = VALUES(intervals), emailTemplate = VALUES(emailTemplate)`,
      [
        userId,
        1,
        JSON.stringify([7, 3, 1]),
        "Please find the attached invoice.",
      ]
    );
    console.log(`  ✓ Created reminder settings\n`);

    // 19. SEED REMINDER LOGS
    console.log("📅 Seeding reminder logs...");
    for (let i = 0; i < 10; i++) {
      const invoiceIdx = Math.floor(Math.random() * invoiceIds.length);
      const daysOverdue = Math.floor(Math.random() * 15);
      await connection.execute(
        `INSERT INTO reminderLogs (invoiceId, userId, sentAt, daysOverdue, recipientEmail, status, errorMessage) VALUES (?, ?, ?, ?, ?, 'sent', NULL)`,
        [
          invoiceIds[invoiceIdx],
          userId,
          daysAgo(Math.floor(Math.random() * 20)),
          daysOverdue,
          "client@example.com",
        ]
      );
    }
    console.log(`  ✓ Created reminder logs\n`);

    // 20. SEED USAGE TRACKING
    console.log("📊 Seeding usage tracking...");
    const months = ["2025-12", "2026-01", "2026-02"];
    for (const month of months) {
      await connection.execute(
        `INSERT INTO usageTracking (userId, month, invoicesCreated, createdAt, updatedAt) VALUES (?, ?, ?, NOW(), NOW()) ON DUPLICATE KEY UPDATE invoicesCreated = VALUES(invoicesCreated)`,
        [userId, month, Math.floor(Math.random() * 20) + 5]
      );
    }
    console.log(`  ✓ Created usage tracking entries\n`);

    // 21. SEED AI CREDITS
    console.log("🤖 Seeding AI credits...");
    const aiCreditMonths = ["2025-11", "2025-12", "2026-01", "2026-02"];
    for (const month of aiCreditMonths) {
      await connection.execute(
        `INSERT INTO aiCredits (userId, month, creditsUsed, creditsLimit, purchasedCredits, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, NOW(), NOW()) ON DUPLICATE KEY UPDATE creditsUsed = VALUES(creditsUsed), purchasedCredits = VALUES(purchasedCredits)`,
        [
          userId,
          month,
          Math.floor(Math.random() * 20),
          50,
          Math.floor(Math.random() * 10),
        ]
      );
    }
    console.log(`  ✓ Created AI credits entries\n`);

    // 22. SEED AI USAGE LOGS
    console.log("📈 Seeding AI usage logs...");
    const aiFeatures = [
      "smart_compose",
      "categorization",
      "prediction",
      "ai_assistant",
    ];
    for (let i = 0; i < 15; i++) {
      const feature = aiFeatures[Math.floor(Math.random() * aiFeatures.length)];
      await connection.execute(
        `INSERT INTO aiUsageLogs (userId, feature, inputTokens, outputTokens, model, success, latencyMs, createdAt) VALUES (?, ?, ?, ?, 'gpt-4', true, ?, NOW())`,
        [
          userId,
          feature,
          Math.floor(Math.random() * 500) + 100,
          Math.floor(Math.random() * 1000) + 200,
          Math.floor(Math.random() * 500) + 100,
        ]
      );
    }
    console.log(`  ✓ Created AI usage log entries\n`);

    // 23. SEED STRIPE WEBHOOK EVENTS
    console.log("🔔 Seeding stripe webhook events...");
    const webhookEvents = [
      { type: "payment_intent.succeeded", processed: 1 },
      { type: "payment_intent.payment_failed", processed: 1 },
      { type: "checkout.session.completed", processed: 1 },
      { type: "invoice.paid", processed: 1 },
      { type: "invoice.payment_failed", processed: 0 },
    ];
    for (let i = 0; i < 6; i++) {
      const event = webhookEvents[i % webhookEvents.length];
      const eventId = `evt_${Math.random().toString(36).slice(2, 15)}`;
      await connection.execute(
        `INSERT INTO stripeWebhookEvents (eventId, eventType, payload, processed, processedAt, createdAt) VALUES (?, ?, ?, ?, ?, NOW())`,
        [
          eventId,
          event.type,
          JSON.stringify({ id: eventId, type: event.type }),
          event.processed,
          daysAgo(Math.floor(Math.random() * 30)),
        ]
      );
    }
    console.log(`  ✓ Created stripe webhook events\n`);

    // 24. SEED INVOICE GENERATION LOGS
    console.log("📑 Seeding invoice generation logs...");
    const generationStatuses = ["success", "success", "success", "failed"];
    for (let i = 0; i < 8; i++) {
      const recurringIdx = Math.floor(Math.random() * recurringIds.length);
      const status =
        generationStatuses[
          Math.floor(Math.random() * generationStatuses.length)
        ];
      await connection.execute(
        `INSERT INTO invoiceGenerationLogs (recurringInvoiceId, generatedInvoiceId, generationDate, status, errorMessage, createdAt) VALUES (?, ?, ?, ?, ?, NOW())`,
        [
          recurringIds[recurringIdx],
          null,
          daysAgo(Math.floor(Math.random() * 30)),
          status,
          status === "failed" ? "Template rendering error" : null,
        ]
      );
    }
    console.log(`  ✓ Created invoice generation logs\n`);

    // 25. SEED QUICKBOOKS INVOICE MAPPING
    console.log("📒 Seeding QuickBooks invoice mapping...");
    const mappedInvoiceIds = new Set();
    for (let i = 0; i < 3; i++) {
      let invoiceIdx;
      do {
        invoiceIdx = Math.floor(Math.random() * invoiceIds.length);
      } while (mappedInvoiceIds.has(invoiceIdx));
      mappedInvoiceIds.add(invoiceIdx);
      const qbId = `QB-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
      await connection.execute(
        `INSERT INTO quickbooksInvoiceMapping (userId, invoiceId, qbInvoiceId, syncVersion, lastSyncedAt, createdAt) VALUES (?, ?, ?, 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE qbInvoiceId = VALUES(qbInvoiceId)`,
        [userId, invoiceIds[invoiceIdx], qbId]
      );
    }
    console.log(`  ✓ Created QuickBooks invoice mappings\n`);

    // 26. SEED CURRENCIES
    console.log("💵 Seeding additional currencies...");
    const currencies = [
      { code: "EUR", name: "Euro", symbol: "€", exchangeRate: "0.92" },
      { code: "GBP", name: "British Pound", symbol: "£", exchangeRate: "0.79" },
      {
        code: "JPY",
        name: "Japanese Yen",
        symbol: "¥",
        exchangeRate: "149.50",
      },
      {
        code: "CAD",
        name: "Canadian Dollar",
        symbol: "C$",
        exchangeRate: "1.36",
      },
      {
        code: "AUD",
        name: "Australian Dollar",
        symbol: "A$",
        exchangeRate: "1.53",
      },
    ];
    for (const currency of currencies) {
      await connection.execute(
        `INSERT INTO currencies (code, name, symbol, exchangeRateToUSD, lastUpdated, isActive) VALUES (?, ?, ?, ?, NOW(), 1) ON DUPLICATE KEY UPDATE name = VALUES(name)`,
        [currency.code, currency.name, currency.symbol, currency.exchangeRate]
      );
    }
    console.log(`  ✓ Added ${currencies.length} currencies\n`);

    // 27. SEED CUSTOM FIELDS
    console.log("🔧 Seeding custom fields...");
    const customFields = [
      { name: "po_number", label: "PO Number", fieldType: "text" },
      { name: "project_code", label: "Project Code", fieldType: "text" },
      { name: "delivery_date", label: "Delivery Date", fieldType: "date" },
    ];
    for (const field of customFields) {
      await connection.execute(
        `INSERT INTO customFields (userId, fieldName, fieldLabel, fieldType, isRequired, createdAt) VALUES (?, ?, ?, ?, false, NOW())`,
        [userId, field.name, field.label, field.fieldType]
      );
    }
    console.log(`  ✓ Created ${customFields.length} custom fields\n`);

    // 28. SEED BATCH INVOICE TEMPLATES
    console.log("📦 Seeding batch invoice templates...");
    await connection.execute(
      `INSERT INTO batchInvoiceTemplates (userId, name, description, dueInDays, currency, taxRate, frequency, usageCount, createdAt) VALUES (?, ?, ?, 30, 'USD', 8.5, 'monthly', 5, NOW())`,
      [
        userId,
        "Monthly Retainer Package",
        "Standard monthly retainer for all clients",
      ]
    );
    console.log(`  ✓ Created batch invoice templates\n`);

    // 29. SEED AUDIT LOG
    console.log("📋 Seeding audit log...");
    const auditActions = ["create", "update", "send", "view", "payment"];
    const auditEntities = ["invoice", "client", "estimate", "payment"];
    for (let i = 0; i < 20; i++) {
      const action =
        auditActions[Math.floor(Math.random() * auditActions.length)];
      const entityType =
        auditEntities[Math.floor(Math.random() * auditEntities.length)];
      await connection.execute(
        `INSERT INTO auditLog (userId, action, entityType, entityId, entityName, ipAddress, userAgent, createdAt) VALUES (?, ?, ?, ?, ?, '192.168.1.100', 'Mozilla/5.0', NOW())`,
        [
          userId,
          action,
          entityType,
          Math.floor(Math.random() * 10) + 1,
          `${entityType}_${i + 1}`,
        ]
      );
    }
    console.log(`  ✓ Created audit log entries\n`);

    console.log("=".repeat(60));
    console.log("✅ Database seeding complete!\n");

    // Print summary
    const tables = [
      "clients",
      "clientContacts",
      "clientTags",
      "clientTagAssignments",
      "invoices",
      "invoiceLineItems",
      "invoiceViews",
      "estimates",
      "estimateLineItems",
      "recurringInvoices",
      "recurringInvoiceLineItems",
      "payments",
      "expenses",
      "expenseCategories",
      "invoiceTemplates",
      "products",
      "customFields",
      "emailLog",
      "reminderSettings",
      "reminderLogs",
      "usageTracking",
      "aiCredits",
      "aiUsageLogs",
      "stripeWebhookEvents",
      "invoiceGenerationLogs",
      "clientPortalAccess",
      "quickbooksInvoiceMapping",
      "currencies",
      "auditLog",
      "batchInvoiceTemplates",
    ];

    console.log("📊 Data Summary:");
    console.log("-".repeat(40));
    for (const table of tables) {
      try {
        const [rows] = await connection.execute(
          `SELECT COUNT(*) as cnt FROM ${table}`
        );
        console.log(`  ${table}: ${rows[0].cnt} records`);
      } catch (e) {
        console.log(`  ${table}: table not found`);
      }
    }
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    await connection.end();
  }
}

seedDatabase().catch(console.error);
