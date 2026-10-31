import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/error.middleware.js';
import apiRoutes from './routes/index.js';

export const createApp = (): Application => {
  const app: Application = express();

  // 1. Trust proxy for rate-limiting behind Vercel or reverse proxy
  app.set('trust proxy', 1);

  // 2. Helmet for secure HTTP headers
  app.use(
    helmet({
      contentSecurityPolicy: false, // Allows cross-origin media rendering if needed
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  // 3. CORS Configuration with dynamic origin allowlist & credentials
  const allowedOrigins = env.CORS_ORIGIN.split(',').map((origin) => origin.trim());
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl, or same-origin)
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error(`CORS blocked for origin: ${origin}`));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // 4. Request Parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser(env.COOKIE_SECRET));

  // 5. Global Rate Limiter
  app.use('/api', apiLimiter);

  // 6. Base Health Check Endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: env.NODE_ENV,
      },
    });
  });

  // 7. Mount Core REST API Endpoints
  app.use('/api', apiRoutes);

  // 8. 404 Route Handler for undefined endpoints
  app.use('/api/*', (_req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'The requested API endpoint does not exist.',
      },
    });
  });

  // 8. Global Centralized Error Handler
  app.use(errorHandler);

  return app;
};

export const app = createApp();

