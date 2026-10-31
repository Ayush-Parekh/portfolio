import { Request, Response, NextFunction } from 'express';
import { certificationRepository } from '../repositories/certification.repository.js';
import { AppError } from '../middleware/error.middleware.js';

export class CertificationController {
  async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await certificationRepository.findAll(true);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const created = await certificationRepository.create(req.body);
      res.status(201).json({ success: true, data: created, message: 'Certification created successfully' });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await certificationRepository.update(req.params.id, req.body);
      if (!updated) {
        throw new AppError('Certification not found', 404, 'NOT_FOUND');
      }
      res.status(200).json({ success: true, data: updated, message: 'Certification updated successfully' });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const deleted = await certificationRepository.delete(req.params.id);
      if (!deleted) {
        throw new AppError('Certification not found', 404, 'NOT_FOUND');
      }
      res.status(200).json({ success: true, message: 'Certification deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async reorder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await certificationRepository.reorder(req.body.items);
      res.status(200).json({ success: true, message: 'Certifications reordered successfully' });
    } catch (error) {
      next(error);
    }
  }

  async setVisibility(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await certificationRepository.setVisibility(req.params.id, req.body.isVisible);
      if (!updated) {
        throw new AppError('Certification not found', 404, 'NOT_FOUND');
      }
      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }
}

export const certificationController = new CertificationController();

