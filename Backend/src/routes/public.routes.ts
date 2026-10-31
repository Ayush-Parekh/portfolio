import { Router } from 'express';
import { publicController } from '../controllers/public.controller.js';
import { contactLimiter } from '../middleware/rateLimiter.js';
import { validateBody, validateParams, contactMessageSchema, slugParamSchema } from '../validators/index.js';

const router = Router();

// 1. Consolidated Portfolio Endpoint (Single round-trip payload for public homepage)
router.get('/portfolio', publicController.getPortfolio);

// 2. Showcase Projects
router.get('/projects', publicController.getProjects);
router.get('/projects/:slug', validateParams(slugParamSchema), publicController.getProjectBySlug);

// 3. Technical Blog
router.get('/blog', publicController.getBlogPosts);
router.get('/blog/:slug', validateParams(slugParamSchema), publicController.getBlogPostBySlug);

// 4. Contact Form Submission (Rate-limited, Zod-validated, DB persistence + Gmail notification)
router.post(
  '/contact',
  contactLimiter,
  validateBody(contactMessageSchema),
  publicController.submitContact
);

export default router;

