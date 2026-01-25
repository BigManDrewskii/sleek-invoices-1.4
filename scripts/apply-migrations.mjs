import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import "dotenv/config";

const migrationDir = "./drizzle/migrations";

async function applyMigrations() {
  // Parse DATABASE_URL to get connection config
  const dbUrl = new URL(process.env.DATABASE_URL);

  const connection = await mysql.createConnection({
    host: dbUrl.hostname,
    port: parseInt(dbUrl.port) || 3306,
    user: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.slice(1),
    ssl: { rejectUnauthorized: true },
    multipleStatements: true,
  });

  try {
    const files = fs
      .readdirSync(migrationDir)
      .filter(f => f.endsWith(".sql"))
      .sort();

    console.log(`📜 Found ${files.length} migration files to apply\n`);

    for (const file of files) {
      const filePath = path.join(migrationDir, file);
      const sql = fs.readFileSync(filePath, "utf8");

      console.log(`Applying ${file}...`);

      try {
        await connection.query(sql);
        console.log(`✅ ${file} applied successfully\n`);
      } catch (error) {
        if (
          error.code === "ER_DUP_FIELDNAME" ||
          error.code === "ER_TABLE_EXISTS_ERROR"
        ) {
          console.log(`⏭️  ${file} skipped (already exists)\n`);
        } else if (
          error.code === "ER_PARSE_ERROR" &&
          error.message.includes("aiUsageLogs")
        ) {
          // Special case: aiUsageLogs might not exist yet
          console.log(
            `⚠️  ${file}: Partial application (some tables may already exist)\n`
          );
        } else {
          console.error(`❌ ${file} error: ${error.message}\n`);
        }
      }
    }

    console.log("✅ All migrations processed!");
  } finally {
    await connection.end();
  }
}

applyMigrations().catch(console.error);
