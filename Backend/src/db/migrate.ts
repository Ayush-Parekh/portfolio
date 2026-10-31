import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db, pool } from '../config/db.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Programmatic database migration runner using Drizzle ORM.
 */
async function runMigrations() {
  console.log('🔄 Commencing PostgreSQL database migrations...');
  const migrationsFolder = path.resolve(__dirname, './migrations');

  try {
    await migrate(db, { migrationsFolder });
    console.log('✅ All migrations applied successfully!');
  } catch (error) {
    console.error('❌ Migration failure:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigrations();

