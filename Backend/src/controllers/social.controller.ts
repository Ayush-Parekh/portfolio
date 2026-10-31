import { Request, Response, NextFunction } from 'express';
import { socialRepository } from '../repositories/social.repository.js';
import { AppError } from '../middleware/error.middleware.js';

export class SocialController {
  async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await socialRepository.findAll(true);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const created = await socialRepository.create(req.body);
      res.status(201).json({ success: true, data: created, message: 'Social link created successfully' });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await socialRepository.update(req.params.id, req.body);
      if (!updated) {
        throw new AppError('Social link not found', 404, 'NOT_FOUND');
      }
      res.status(200).json({ success: true, data: updated, message: 'Social link updated successfully' });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const deleted = await socialRepository.delete(req.params.id);
      if (!deleted) {
        throw new AppError('Social link not found', 404, 'NOT_FOUND');
      }
      res.status(200).json({ success: true, message: 'Social link deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async reorder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await socialRepository.reorder(req.body.items);
      res.status(200).json({ success: true, message: 'Social links reordered successfully' });
    } catch (error) {
      next(error);
    }
  }

  async setVisibility(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await socialRepository.setVisibility(req.params.id, req.body.isVisible);
      if (!updated) {
        throw new AppError('Social link not found', 404, 'NOT_FOUND');
      }
      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }
}

export const socialController = new SocialController();

