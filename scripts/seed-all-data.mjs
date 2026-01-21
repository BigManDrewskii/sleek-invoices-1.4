import mysql from "mysql2/promise";

const DATABASE_URL =
  "mysql://sleekinvoices:localdev123@localhost:3306/sleekinvoices_dev";
const url = new URL(DATABASE_URL);

async function seedDatabase() {
  const connection = await mysql.createConnection({
    host: url.hostname || "localhost",
    port: parseInt(url.port) || 3306,
    user: url.username,
    password: url.password,
    database: url.pathname.slice(1),
  });

  console.log("🌱 Starting database seed...\n");

  try {
    console.log("Clearing existing test data...");

    await connection.execute(
      "DELETE FROM invoiceLineItems WHERE invoiceId > 0"
    );
    await connection.execute("DELETE FROM payments WHERE id > 0");
    await connection.execute("DELETE FROM expenses WHERE id > 0");
    await connection.execute("DELETE FROM invoiceGenerationLogs WHERE id > 0");
    await connection.execute("DELETE FROM emailLog WHERE id > 0");
    await connection.execute("DELETE FROM reminderLogs WHERE id > 0");
    await connection.execute("DELETE FROM usageTracking WHERE id > 0");
    await connection.execute("DELETE FROM stripeWebhookEvents WHERE id > 0");
    await connection.execute("DELETE FROM clientPortalAccess WHERE id > 0");
    await connection.execute(
      "DELETE FROM recurringInvoiceLineItems WHERE recurringInvoiceId > 0"
    );
    await connection.execute(
      "DELETE FROM quickbooksInvoiceMapping WHERE id > 0"
    );
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
        `INSERT INTO clients (userId, name, email, companyName, address, phone, vatNumber, taxExempt, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, ?, ?, ?, false, NOW(), NOW())`,
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

    // 2. SEED INVOICE TEMPLATES
    console.log("🎨 Seeding invoice templates...");
    const templates = [
      {
        name: "Professional Dark",
        primaryColor: "#0f172a",
        secondaryColor: "#1e293b",
        accentColor: "#3b82f6",
      },
      {
        name: "Classic Blue",
        primaryColor: "#1e40af",
        secondaryColor: "#3b82f6",
        accentColor: "#60a5fa",
      },
      {
        name: "Modern Green",
        primaryColor: "#059669",
        secondaryColor: "#10b981",
        accentColor: "#34d399",
      },
      {
        name: "Bold Red",
        primaryColor: "#dc2626",
        secondaryColor: "#ef4444",
        accentColor: "#f87171",
      },
      {
        name: "Elegant Purple",
        primaryColor: "#7c3aed",
        secondaryColor: "#8b5cf6",
        accentColor: "#a78bfa",
      },
      {
        name: "Tech Cyan",
        primaryColor: "#0284c7",
        secondaryColor: "#0ea5e9",
        accentColor: "#38bdf8",
      },
    ];

    const templateIds = [];
    for (const template of templates) {
      const [result] = await connection.execute(
        `INSERT INTO invoiceTemplates (userId, name, primaryColor, secondaryColor, accentColor, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          userId,
          template.name,
          template.primaryColor,
          template.secondaryColor,
          template.accentColor,
        ]
      );
      templateIds.push(result.insertId);
    }
    console.log(`  ✓ Created ${templates.length} invoice templates\n`);

    // 3. SEED INVOICES
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
        `INSERT INTO invoices (userId, clientId, invoiceNumber, status, currency, subtotal, taxRate, taxAmount, total, amountPaid, issueDate, dueDate, templateId, notes, paymentTerms, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, 'USD', ?, ?, ?, ?, ?, ?, ?, ?, 'Payment due within 30 days', 'Net 30', NOW(), NOW())`,
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

    // 4. SEED INVOICE LINE ITEMS
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
          `INSERT INTO invoiceLineItems (invoiceId, description, quantity, rate, amount, sortOrder, createdAt) 
           VALUES (?, ?, ?, ?, ?, ?, NOW())`,
          [invoiceId, desc, quantity, rate, amount, i]
        );
      }
    }
    console.log(`  ✓ Created line items for all invoices\n`);

    // 5. SEED PAYMENTS
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
        `INSERT INTO payments (userId, invoiceId, amount, currency, paymentMethod, status, paymentDate, createdAt, updatedAt) 
         VALUES (?, ?, ?, 'USD', ?, ?, NOW(), NOW(), NOW())`,
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

    // 6. SEED EXPENSE CATEGORIES
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
        `INSERT INTO expenseCategories (userId, name, icon, color, createdAt) 
         VALUES (?, ?, ?, ?, NOW())`,
        [userId, category.name, category.icon, category.color]
      );
      categoryIds.push(result.insertId);
    }
    console.log(`  ✓ Created ${expenseCategories.length} expense categories\n`);

    // 7. SEED EXPENSES
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
        `INSERT INTO expenses (userId, categoryId, amount, currency, date, vendor, description, paymentMethod, taxAmount, isRecurring, createdAt, updatedAt) 
         VALUES (?, ?, ?, 'USD', ?, ?, ?, 'credit_card', 0, 0, NOW(), NOW())`,
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

    // 8. SEED RECURRING INVOICES
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
        `INSERT INTO recurringInvoices (userId, clientId, frequency, startDate, endDate, nextInvoiceDate, invoiceNumberPrefix, taxRate, discountType, discountValue, notes, paymentTerms, isActive, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, ?, ?, ?, '8.00', 'percentage', 0, ?, ?, true, NOW(), NOW())`,
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

    // 9. SEED RECURRING INVOICE LINE ITEMS
    console.log("📋 Seeding recurring invoice line items...");
    const recurringLineItems = [
      "Website maintenance and updates",
      "Bug fixes and security patches",
      "Performance optimization",
      "Analytics and reporting",
      "API maintenance and monitoring",
    ];

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
          `INSERT INTO recurringInvoiceLineItems (recurringInvoiceId, description, quantity, rate, sortOrder, createdAt) 
           VALUES (?, ?, ?, ?, ?, NOW())`,
          [recurringId, desc, quantity, rate, i]
        );
      }
    }
    console.log(`  ✓ Created recurring invoice line items\n`);

    // 10. SEED CLIENT PORTAL ACCESS
    console.log("🔐 Seeding client portal access...");
    for (let i = 0; i < 5; i++) {
      const accessToken = Buffer.from(
        `${clientIds[i]}-${Date.now()}-${Math.random().toString(36).slice(2)}`
      ).toString("base64url");
      await connection.execute(
        `INSERT INTO clientPortalAccess (clientId, accessToken, expiresAt, createdAt) 
         VALUES (?, ?, ?, NOW())`,
        [clientIds[i], accessToken, daysFromNow(365)]
      );
    }
    console.log(`  ✓ Created client portal access tokens\n`);

    // 11. SEED EMAIL LOG
    console.log("📧 Seeding email log...");
    const emailTypes = ["invoice", "reminder", "receipt"];

    for (let i = 0; i < 8; i++) {
      const invoiceIdx = Math.floor(Math.random() * invoiceIds.length);
      const type = emailTypes[Math.floor(Math.random() * emailTypes.length)];

      await connection.execute(
        `INSERT INTO emailLog (userId, invoiceId, recipientEmail, subject, emailType, sentAt, success, errorMessage) 
         VALUES (?, ?, ?, ?, ?, ?, 1, NULL)`,
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

    // 12. SEED REMINDER SETTINGS
    console.log("⏰ Seeding reminder settings...");
    await connection.execute(
      `INSERT INTO reminderSettings (userId, enabled, intervals, emailTemplate, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, NOW(), NOW())
       ON DUPLICATE KEY UPDATE enabled = VALUES(enabled), intervals = VALUES(intervals), emailTemplate = VALUES(emailTemplate)`,
      [
        userId,
        1,
        JSON.stringify([7, 3, 1]),
        "Please find the attached invoice.",
      ]
    );
    console.log(`  ✓ Created reminder settings\n`);

    // 13. SEED REMINDER LOGS
    console.log("📅 Seeding reminder logs...");
    for (let i = 0; i < 10; i++) {
      const invoiceIdx = Math.floor(Math.random() * invoiceIds.length);
      const daysOverdue = Math.floor(Math.random() * 15);

      await connection.execute(
        `INSERT INTO reminderLogs (invoiceId, userId, sentAt, daysOverdue, recipientEmail, status, errorMessage) 
         VALUES (?, ?, ?, ?, ?, 'sent', NULL)`,
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

    // 14. SEED USAGE TRACKING
    console.log("📊 Seeding usage tracking...");

    const months = ["2025-12", "2026-01", "2026-02"];
    for (const month of months) {
      await connection.execute(
        `INSERT INTO usageTracking (userId, month, invoicesCreated, createdAt, updatedAt) 
         VALUES (?, ?, ?, NOW(), NOW())
         ON DUPLICATE KEY UPDATE invoicesCreated = VALUES(invoicesCreated)`,
        [userId, month, Math.floor(Math.random() * 20) + 5]
      );
    }
    console.log(`  ✓ Created usage tracking entries\n`);

    // 15. SEED STRIPE WEBHOOK EVENTS
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
        `INSERT INTO stripeWebhookEvents (eventId, eventType, payload, processed, processedAt, createdAt) 
         VALUES (?, ?, ?, ?, ?, NOW())`,
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

    // 16. SEED INVOICE GENERATION LOGS
    console.log("📑 Seeding invoice generation logs...");
    const generationStatuses = ["success", "success", "success", "failed"];

    for (let i = 0; i < 8; i++) {
      const recurringIdx = Math.floor(Math.random() * recurringIds.length);
      const status =
        generationStatuses[
          Math.floor(Math.random() * generationStatuses.length)
        ];

      await connection.execute(
        `INSERT INTO invoiceGenerationLogs (recurringInvoiceId, generatedInvoiceId, generationDate, status, errorMessage, createdAt) 
         VALUES (?, ?, ?, ?, ?, NOW())`,
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

    // 17. SEED QUICKBOOKS INVOICE MAPPING
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
        `INSERT INTO quickbooksInvoiceMapping (userId, invoiceId, qbInvoiceId, syncVersion, lastSyncedAt, createdAt) 
         VALUES (?, ?, ?, 1, NOW(), NOW())
         ON DUPLICATE KEY UPDATE qbInvoiceId = VALUES(qbInvoiceId)`,
        [userId, invoiceIds[invoiceIdx], qbId]
      );
    }
    console.log(`  ✓ Created QuickBooks invoice mappings\n`);

    // 18. SEED CURRENCIES
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
        `INSERT INTO currencies (code, name, symbol, exchangeRateToUSD, lastUpdated, isActive) 
         VALUES (?, ?, ?, ?, NOW(), 1)
         ON DUPLICATE KEY UPDATE name = VALUES(name), symbol = VALUES(symbol)`,
        [currency.code, currency.name, currency.symbol, currency.exchangeRate]
      );
    }
    console.log(`  ✓ Added ${currencies.length} currencies\n`);

    console.log("=".repeat(60));
    console.log("✅ Database seeding complete!\n");

    // Print summary
    const tables = [
      "clients",
      "invoices",
      "invoiceLineItems",
      "payments",
      "expenses",
      "expenseCategories",
      "recurringInvoices",
      "recurringInvoiceLineItems",
      "invoiceTemplates",
      "emailLog",
      "reminderSettings",
      "reminderLogs",
      "usageTracking",
      "stripeWebhookEvents",
      "clientPortalAccess",
      "quickbooksInvoiceMapping",
      "invoiceGenerationLogs",
      "currencies",
    ];

    console.log("📊 Data Summary:");
    console.log("-".repeat(40));
    for (const table of tables) {
      const [rows] = await connection.execute(
        `SELECT COUNT(*) as cnt FROM ${table}`
      );
      console.log(`  ${table}: ${rows[0].cnt} records`);
    }
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    await connection.end();
  }
}

seedDatabase().catch(console.error);
