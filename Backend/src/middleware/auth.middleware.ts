import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export interface AuthUserPayload {
  id: string;
  email: string;
  fullName: string;
}

// Extend Express Request type globally to include authenticated admin user
declare global {
  namespace Express {
    interface Request {
      user?: AuthUserPayload;
    }
  }
}

/**
 * Authentication middleware for admin routes.
 * Inspects httpOnly cookie `auth_token` first, with fallback to `Authorization: Bearer <token>`.
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const tokenFromCookie = req.cookies?.auth_token;
    const authHeader = req.headers.authorization;
    const tokenFromHeader = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    const token = tokenFromCookie || tokenFromHeader;

    if (!token) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required. No session token provided.',
        },
      });
      return;
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as AuthUserPayload;
    req.user = decoded;
    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      res.status(401).json({
        success: false,
        error: {
          code: 'TOKEN_EXPIRED',
          message: 'Your session has expired. Please log in again.',
        },
      });
      return;
    }

    res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid authentication credentials.',
      },
    });
  }
};

