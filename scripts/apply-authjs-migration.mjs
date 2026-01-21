import mysql from 'mysql2/promise';
import 'dotenv/config';

async function applyAuthJsMigration() {
  const dbUrl = new URL(process.env.DATABASE_URL);

  const connection = await mysql.createConnection({
    host: dbUrl.hostname,
    port: parseInt(dbUrl.port) || 3306,
    user: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.slice(1),
    ssl: { rejectUnauthorized: true },
    multipleStatements: true
  });

  try {
    console.log('🔧 Applying Auth.js migration in separate steps...\n');

    // Step 1: Add columns without UNIQUE constraint
    console.log('Step 1: Adding uuid, emailVerified, image columns...');
    try {
      await connection.query(`
        ALTER TABLE users
        ADD COLUMN uuid CHAR(36) NULL AFTER id,
        ADD COLUMN emailVerified TIMESTAMP NULL AFTER email,
        ADD COLUMN image TEXT NULL AFTER avatarUrl
      `);
      console.log('✅ Columns added\n');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('⏭️  Columns already exist, skipping...\n');
      } else {
        throw error;
      }
    }

    // Step 2: Add UNIQUE constraint on uuid separately
    console.log('Step 2: Adding UNIQUE constraint on uuid...');
    try {
      await connection.query(`CREATE UNIQUE INDEX idx_users_uuid_unique ON users(uuid)`);
      console.log('✅ UNIQUE constraint added\n');
    } catch (error) {
      if (error.code === 'ER_DUP_KEYNAME' || error.code === 'ER_KEY_FILE_DOES_NOT_EXIST') {
        console.log('⏭️  Index already exists, skipping...\n');
      } else {
        console.log(`Warning: ${error.message}\n`);
      }
    }

    // Step 3: Add index on uuid for faster lookups
    console.log('Step 3: Adding index on uuid...');
    try {
      await connection.query(`CREATE INDEX idx_users_uuid ON users(uuid)`);
      console.log('✅ Index added\n');
    } catch (error) {
      if (error.code === 'ER_DUP_KEYNAME') {
        console.log('⏭️  Index already exists, skipping...\n');
      } else {
        console.log(`Warning: ${error.message}\n`);
      }
    }

    // Step 4: Modify openId column
    console.log('Step 4: Modifying openId column...');
    try {
      await connection.query(`ALTER TABLE users MODIFY COLUMN openId VARCHAR(64) UNIQUE NULL`);
      console.log('✅ openId column modified\n');
    } catch (error) {
      console.log(`Warning: ${error.message}\n`);
    }

    // Step 5: Create accounts table
    console.log('Step 5: Creating accounts table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS accounts (
        id CHAR(36) PRIMARY KEY,
        userId INT NOT NULL,
        type VARCHAR(50) NOT NULL,
        provider VARCHAR(50) NOT NULL,
        providerAccountId VARCHAR(255) NOT NULL,
        refresh_token TEXT,
        access_token TEXT,
        expires_at INT,
        token_type VARCHAR(50),
        scope VARCHAR(255),
        id_token TEXT,
        session_state VARCHAR(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_provider_account (provider, providerAccountId)
      )
    `);
    console.log('✅ accounts table created\n');

    // Step 6: Create sessions table
    console.log('Step 6: Creating sessions table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id CHAR(36) PRIMARY KEY,
        userId INT NOT NULL,
        expires TIMESTAMP NOT NULL,
        sessionToken VARCHAR(255) NOT NULL UNIQUE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ sessions table created\n');

    console.log('✅ Auth.js migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  } finally {
    await connection.end();
  }
}

applyAuthJsMigration();
