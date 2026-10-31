import * as dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables from .env file
dotenv.config();

/**
 * Environment configuration schema validated via Zod.
 * Ensures the server fails fast if critical variables are missing or misconfigured.
 */
const envSchema = z.object({
  PORT: z.string().default('5000').transform((val) => parseInt(val, 10)),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters long'),
  COOKIE_SECRET: z.string().min(16, 'COOKIE_SECRET must be at least 16 characters long'),
  CORS_ORIGIN: z.string().default('http://localhost:5173,http://localhost:5174'),
  CLOUDINARY_CLOUD_NAME: z.string().optional().default(''),
  CLOUDINARY_API_KEY: z.string().optional().default(''),
  CLOUDINARY_API_SECRET: z.string().optional().default(''),
  SMTP_HOST: z.string().optional().default('smtp.gmail.com'),
  SMTP_PORT: z.string().optional().default('465').transform((val) => parseInt(val, 10)),
  SMTP_USER: z.string().optional().default(''),
  SMTP_PASS: z.string().optional().default(''),
  SMTP_FROM: z.string().optional().default('Ayush Parekh Portfolio <ayushwork@gmail.com>'),
  ADMIN_EMAIL: z.string().email().default('ayushwork@gmail.com'),
  ADMIN_PASSWORD: z.string().min(8).default('AdminSecurePassword2026!'),
  ADMIN_NAME: z.string().default('Ayush Parekh'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:', JSON.stringify(parsedEnv.error.format(), null, 2));
  process.exit(1);
}

export const env = parsedEnv.data;

