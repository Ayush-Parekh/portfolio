import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { adminRepository } from '../repositories/admin.repository.js';
import { env } from '../config/env.js';
import { AppError } from '../middleware/error.middleware.js';

export class AuthService {
  async login(email: string, password: string) {
    const admin = await adminRepository.findByEmail(email);

    if (!admin) {
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    const payload = {
      id: admin.id,
      email: admin.email,
      fullName: admin.fullName,
    };

    const token = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: '7d',
    });

    return {
      token,
      user: payload,
    };
  }

  async getProfile(userId: string) {
    const user = await adminRepository.findById(userId);
    if (!user) {
      throw new AppError('Admin account not found', 404, 'USER_NOT_FOUND');
    }
    return user;
  }
}

export const authService = new AuthService();

