import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { env } from './env.js';
import * as schema from '../db/schema.js';

/**
 * Configure PostgreSQL connection pool.
 * Supports both local PostgreSQL development and Neon Serverless pooling in production.
 */
const isSslRequired = env.DATABASE_URL.includes('sslmode=require') || env.NODE_ENV === 'production';

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: isSslRequired ? { rejectUnauthorized: false } : false,
  max: 10, // Maintain a conservative connection pool for serverless/shared DB environments
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Attach error listener to prevent idle client crashes
pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client pool:', err);
});

/**
 * Initialized Drizzle ORM client with full schema mapping
 */
export const db = drizzle(pool, { schema });

