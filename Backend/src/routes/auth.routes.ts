import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validateBody, loginSchema } from '../validators/index.js';

const router = Router();

// Strict rate-limited login endpoint
router.post('/login', authLimiter, validateBody(loginSchema), authController.login);

// Logout endpoint
router.post('/logout', authController.logout);

// Protected profile endpoint
router.get('/me', requireAuth, authController.me);

export default router;

