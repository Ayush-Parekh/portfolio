import { Request, Response, NextFunction } from 'express';
import { testimonialRepository } from '../repositories/testimonial.repository.js';
import { AppError } from '../middleware/error.middleware.js';

export class TestimonialController {
  async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await testimonialRepository.findAll(true);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const created = await testimonialRepository.create(req.body);
      res.status(201).json({ success: true, data: created, message: 'Testimonial created successfully' });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await testimonialRepository.update(req.params.id, req.body);
      if (!updated) {
        throw new AppError('Testimonial not found', 404, 'NOT_FOUND');
      }
      res.status(200).json({ success: true, data: updated, message: 'Testimonial updated successfully' });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const deleted = await testimonialRepository.delete(req.params.id);
      if (!deleted) {
        throw new AppError('Testimonial not found', 404, 'NOT_FOUND');
      }
      res.status(200).json({ success: true, message: 'Testimonial deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async reorder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await testimonialRepository.reorder(req.body.items);
      res.status(200).json({ success: true, message: 'Testimonials reordered successfully' });
    } catch (error) {
      next(error);
    }
  }

  async setVisibility(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await testimonialRepository.setVisibility(req.params.id, req.body.isVisible);
      if (!updated) {
        throw new AppError('Testimonial not found', 404, 'NOT_FOUND');
      }
      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }
}

export const testimonialController = new TestimonialController();

