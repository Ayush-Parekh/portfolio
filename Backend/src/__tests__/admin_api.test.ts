import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { app } from '../app.js';
import { env } from '../config/env.js';
import { adminRepository } from '../repositories/admin.repository.js';
import bcrypt from 'bcryptjs';

describe('Admin Authentication & Protected API Endpoints', () => {
  const mockAdminUser = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'ayushwork@gmail.com',
    fullName: 'Ayush Parekh',
    passwordHash: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    vi.restoreAllMocks();
    mockAdminUser.passwordHash = await bcrypt.hash('CorrectPassword123!', 10);
  });

  describe('POST /api/auth/login', () => {
    it('should reject login when request body is invalid (missing password)', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'not-an-email' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should reject login when credentials do not match', async () => {
      vi.spyOn(adminRepository, 'findByEmail').mockResolvedValue(mockAdminUser as any);

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'ayushwork@gmail.com',
          password: 'WrongPassword!',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('INVALID_CREDENTIALS');
    });

    it('should authenticate successfully with correct credentials and set httpOnly cookie', async () => {
      vi.spyOn(adminRepository, 'findByEmail').mockResolvedValue(mockAdminUser as any);

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'ayushwork@gmail.com',
          password: 'CorrectPassword123!',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe('ayushwork@gmail.com');
      expect(res.body.data).toHaveProperty('token');

      // Check cookie headers
      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies[0]).toContain('auth_token=');
      expect(cookies[0]).toContain('HttpOnly');
    });
  });

  describe('GET /api/auth/me & Admin Route Protection', () => {
    it('should reject access to protected routes without a token', async () => {
      const res = await request(app).get('/api/admin/dashboard/stats');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });

    it('should reject access with an invalid/tampered token', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard/stats')
        .set('Authorization', 'Bearer invalid_tampered_token_xyz');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('INVALID_TOKEN');
    });

    it('should allow access to /api/auth/me with a valid JWT token', async () => {
      const validToken = jwt.sign(
        { id: mockAdminUser.id, email: mockAdminUser.email, fullName: mockAdminUser.fullName },
        env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      vi.spyOn(adminRepository, 'findById').mockResolvedValue({
        id: mockAdminUser.id,
        email: mockAdminUser.email,
        fullName: mockAdminUser.fullName,
        createdAt: mockAdminUser.createdAt,
        updatedAt: mockAdminUser.updatedAt,
      } as any);

      const res = await request(app)
        .get('/api/auth/me')
        .set('Cookie', [`auth_token=${validToken}`]);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe('ayushwork@gmail.com');
    });

    it('should clear cookie upon calling POST /api/auth/logout', async () => {
      const res = await request(app).post('/api/auth/logout');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies[0]).toContain('auth_token=;');
    });
  });

  describe('Zod Parameter Validation on Admin Routes', () => {
    it('should reject invalid UUID parameters with 400 Bad Request', async () => {
      const validToken = jwt.sign(
        { id: mockAdminUser.id, email: mockAdminUser.email, fullName: mockAdminUser.fullName },
        env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      const res = await request(app)
        .get('/api/admin/projects/not-a-valid-uuid')
        .set('Cookie', [`auth_token=${validToken}`]);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });
});

