import { Request, Response, NextFunction } from 'express';
import { experienceRepository } from '../repositories/experience.repository.js';
import { AppError } from '../middleware/error.middleware.js';

export class ExperienceController {
  async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await experienceRepository.findAll(true);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const created = await experienceRepository.create(req.body);
      res.status(201).json({ success: true, data: created, message: 'Experience created successfully' });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await experienceRepository.update(req.params.id, req.body);
      if (!updated) {
        throw new AppError('Experience milestone not found', 404, 'NOT_FOUND');
      }
      res.status(200).json({ success: true, data: updated, message: 'Experience updated successfully' });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const deleted = await experienceRepository.delete(req.params.id);
      if (!deleted) {
        throw new AppError('Experience milestone not found', 404, 'NOT_FOUND');
      }
      res.status(200).json({ success: true, message: 'Experience deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async reorder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await experienceRepository.reorder(req.body.items);
      res.status(200).json({ success: true, message: 'Experiences reordered successfully' });
    } catch (error) {
      next(error);
    }
  }

  async setVisibility(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await experienceRepository.setVisibility(req.params.id, req.body.isVisible);
      if (!updated) {
        throw new AppError('Experience milestone not found', 404, 'NOT_FOUND');
      }
      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }
}

export const experienceController = new ExperienceController();

