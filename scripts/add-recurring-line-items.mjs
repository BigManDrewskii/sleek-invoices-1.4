import mysql from "mysql2/promise";

const DATABASE_URL =
  "mysql://sleekinvoices:localdev123@localhost:3306/sleekinvoices_dev";
const url = new URL(DATABASE_URL);

async function addRecurringInvoiceLineItems() {
  const connection = await mysql.createConnection({
    host: url.hostname || "localhost",
    port: parseInt(url.port) || 3306,
    user: url.username,
    password: url.password,
    database: url.pathname.slice(1),
  });

  console.log("Adding line items to recurring invoices...\n");

  try {
    // Get all recurring invoices
    const [recurringInvoices] = await connection.execute(
      "SELECT id, notes FROM recurringInvoices"
    );
    console.log(`Found ${recurringInvoices.length} recurring invoices`);

    // Sample line items for different types of services
    const lineItemTemplates = [
      // Web development
      [
        {
          description: "Website Development - Frontend",
          quantity: 40,
          rate: 150,
        },
        {
          description: "Website Development - Backend",
          quantity: 30,
          rate: 175,
        },
        {
          description: "Responsive Design Implementation",
          quantity: 20,
          rate: 125,
        },
        { description: "Cross-browser Testing & QA", quantity: 10, rate: 100 },
      ],
      // Mobile app
      [
        {
          description: "Mobile App - iOS Development",
          quantity: 60,
          rate: 175,
        },
        {
          description: "Mobile App - Android Development",
          quantity: 60,
          rate: 165,
        },
        { description: "API Integration", quantity: 20, rate: 150 },
        { description: "App Store Submission", quantity: 5, rate: 200 },
      ],
      // Database
      [
        {
          description: "Database Design & Architecture",
          quantity: 16,
          rate: 200,
        },
        { description: "Query Optimization", quantity: 12, rate: 175 },
        { description: "Backup & Recovery Setup", quantity: 8, rate: 150 },
        { description: "Performance Monitoring", quantity: 8, rate: 125 },
      ],
      // Social media
      [
        {
          description: "Content Strategy Development",
          quantity: 10,
          rate: 150,
        },
        {
          description: "Social Media Posts (12 posts)",
          quantity: 12,
          rate: 100,
        },
        { description: "Community Management", quantity: 8, rate: 75 },
        { description: "Analytics Report", quantity: 4, rate: 125 },
      ],
      // Content writing
      [
        { description: "Blog Posts (4 articles)", quantity: 4, rate: 300 },
        { description: "Copywriting - Landing Pages", quantity: 2, rate: 400 },
        { description: "Email Newsletter", quantity: 4, rate: 200 },
        { description: "SEO Optimization", quantity: 8, rate: 125 },
      ],
      // Cloud infrastructure
      [
        { description: "Cloud Architecture Design", quantity: 16, rate: 200 },
        {
          description: "Server Setup & Configuration",
          quantity: 12,
          rate: 175,
        },
        { description: "Security Implementation", quantity: 8, rate: 200 },
        { description: "Monitoring & Alerting Setup", quantity: 8, rate: 150 },
      ],
    ];

    let totalItemsAdded = 0;

    for (const ri of recurringInvoices) {
      // Determine which template to use based on notes
      let templateIndex = 0;
      const notes = ri.notes?.toLowerCase() || "";

      if (notes.includes("web")) templateIndex = 0;
      else if (notes.includes("mobile")) templateIndex = 1;
      else if (notes.includes("database")) templateIndex = 2;
      else if (notes.includes("social")) templateIndex = 3;
      else if (notes.includes("content")) templateIndex = 4;
      else if (notes.includes("cloud")) templateIndex = 5;
      else templateIndex = Math.floor(Math.random() * lineItemTemplates.length);

      const items = lineItemTemplates[templateIndex];
      let sortOrder = 0;

      for (const item of items) {
        try {
          await connection.execute(
            `INSERT INTO recurringInvoiceLineItems 
             (recurringInvoiceId, description, quantity, rate, sortOrder, createdAt) 
             VALUES (?, ?, ?, ?, ?, NOW())`,
            [
              ri.id,
              item.description,
              item.quantity.toString(),
              item.rate.toString(),
              sortOrder,
            ]
          );
          sortOrder++;
          totalItemsAdded++;
        } catch (error) {
          if (error.code !== "ER_DUP_ENTRY") {
            console.log(
              `  Error adding line item to RI #${ri.id}: ${error.message}`
            );
          }
        }
      }

      console.log(`  ✓ RI #${ri.id}: Added ${items.length} line items`);
    }

    console.log(`\n${"=".repeat(60)}`);
    console.log(
      `\n✅ Added ${totalItemsAdded} line items to ${recurringInvoices.length} recurring invoices!`
    );
  } catch (error) {
    console.log("Error:", error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

addRecurringInvoiceLineItems().catch(console.error);
