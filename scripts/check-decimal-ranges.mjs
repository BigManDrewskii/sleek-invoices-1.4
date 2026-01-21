import mysql from "mysql2/promise";

async function checkDataRanges() {
  const connection = await mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "sleekinvoices",
    password: "localdev123",
    database: "sleekinvoices_dev",
  });

  try {
    console.log("=== CHECKING DATA RANGES FOR PRECISION MISMATCH ===\n");

    // Check invoices
    console.log("--- INVOICES ---");
    const [invoices] = await connection.execute(`
      SELECT 
        MAX(subtotal) as max_subtotal,
        MAX(taxAmount) as max_tax,
        MAX(total) as max_total,
        MAX(amountPaid) as max_paid,
        MAX(discountValue) as max_disc_val,
        MAX(discountAmount) as max_disc_amt,
        MAX(cryptoAmount) as max_crypto
      FROM invoices
    `);
    console.log("Invoices max values:");
    console.log("  subtotal:", invoices[0].max_subtotal);
    console.log("  taxAmount:", invoices[0].max_tax);
    console.log("  total:", invoices[0].max_total);
    console.log("  amountPaid:", invoices[0].max_paid);
    console.log("  discountValue:", invoices[0].max_disc_val);
    console.log("  discountAmount:", invoices[0].max_disc_amt);
    console.log("  cryptoAmount:", invoices[0].max_crypto);

    // Check if any values exceed DECIMAL(10,2) range
    console.log("\nChecking for values that would overflow DECIMAL(10,2):");
    const [overflows] = await connection.execute(`
      SELECT COUNT(*) as cnt FROM invoices 
      WHERE subtotal > 99999999.99 OR taxAmount > 99999999.99 
         OR total > 99999999.99 OR amountPaid > 99999999.99
    `);
    console.log("  Records that would overflow:", overflows[0].cnt);

    // Check expenses
    console.log("\n--- EXPENSES ---");
    const [expenses] = await connection.execute(`
      SELECT MAX(amount) as max_amount, MAX(taxAmount) as max_tax
      FROM expenses
    `);
    console.log("Expenses max values:");
    console.log("  amount:", expenses[0].max_amount);
    console.log("  taxAmount:", expenses[0].max_tax);

    const [expOverflows] = await connection.execute(`
      SELECT COUNT(*) as cnt FROM expenses 
      WHERE amount > 99999999.99 OR taxAmount > 99999999.99
    `);
    console.log("  Records that would overflow:", expOverflows[0].cnt);

    console.log("\n=== RECOMMENDATION ===");
    console.log(
      "If max values are below 99999999.99, we can safely downgrade to DECIMAL(10,2)"
    );
    console.log(
      "Otherwise, we should keep the current precision or upgrade DB to match schema."
    );
  } finally {
    await connection.end();
  }
}

checkDataRanges();
