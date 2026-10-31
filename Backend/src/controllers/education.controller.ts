import { Request, Response, NextFunction } from 'express';
import { educationRepository } from '../repositories/education.repository.js';
import { AppError } from '../middleware/error.middleware.js';

export class EducationController {
  async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await educationRepository.findAll(true);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const created = await educationRepository.create(req.body);
      res.status(201).json({ success: true, data: created, message: 'Education record created successfully' });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await educationRepository.update(req.params.id, req.body);
      if (!updated) {
        throw new AppError('Education record not found', 404, 'NOT_FOUND');
      }
      res.status(200).json({ success: true, data: updated, message: 'Education record updated successfully' });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const deleted = await educationRepository.delete(req.params.id);
      if (!deleted) {
        throw new AppError('Education record not found', 404, 'NOT_FOUND');
      }
      res.status(200).json({ success: true, message: 'Education record deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async reorder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await educationRepository.reorder(req.body.items);
      res.status(200).json({ success: true, message: 'Education records reordered successfully' });
    } catch (error) {
      next(error);
    }
  }

  async setVisibility(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await educationRepository.setVisibility(req.params.id, req.body.isVisible);
      if (!updated) {
        throw new AppError('Education record not found', 404, 'NOT_FOUND');
      }
      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }
}

export const educationController = new EducationController();

