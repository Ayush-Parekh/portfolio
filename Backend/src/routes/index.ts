import { Router } from 'express';
import authRoutes from './auth.routes.js';
import adminRoutes from './admin.routes.js';
import publicRoutes from './public.routes.js';

const router = Router();

// 1. Public Portfolio endpoints: /api/public/*
router.use('/public', publicRoutes);

// 2. Authentication endpoints: /api/auth/*
router.use('/auth', authRoutes);

// 3. Admin management endpoints: /api/admin/*
router.use('/admin', adminRoutes);

export default router;

