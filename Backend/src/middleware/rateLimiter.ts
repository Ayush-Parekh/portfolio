import rateLimit from 'express-rate-limit';

/**
 * Strict rate limiter for authentication endpoints to prevent brute-force attacks.
 * Max 10 attempts per 15 minutes window.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many authentication attempts. Please try again after 15 minutes.',
    },
  },
});

/**
 * Strict rate limiter for public contact form submissions to prevent spam.
 * Max 5 submissions per 15 minutes window.
 */
export const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many message submissions. Please try again after 15 minutes.',
    },
  },
});

/**
 * General API rate limiter.
 * Max 200 requests per minute per IP address.
 */
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many requests. Please slow down.',
    },
  },
});

