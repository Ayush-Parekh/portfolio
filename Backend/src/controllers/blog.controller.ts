import { Request, Response, NextFunction } from 'express';
import { blogRepository } from '../repositories/blog.repository.js';
import { AppError } from '../middleware/error.middleware.js';

export class BlogController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const includeUnpublished = req.query.includeUnpublished === 'true' || true;
      const data = await blogRepository.findAll(includeUnpublished);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const item = await blogRepository.findById(req.params.id);
      if (!item) {
        throw new AppError('Blog post not found', 404, 'NOT_FOUND');
      }
      res.status(200).json({ success: true, data: item });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const created = await blogRepository.create(req.body);
      res.status(201).json({ success: true, data: created, message: 'Blog post created successfully' });
    } catch (error: any) {
      if (error.code === '23505') {
        next(new AppError('A blog post with this slug already exists', 409, 'DUPLICATE_SLUG'));
        return;
      }
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await blogRepository.update(req.params.id, req.body);
      if (!updated) {
        throw new AppError('Blog post not found', 404, 'NOT_FOUND');
      }
      res.status(200).json({ success: true, data: updated, message: 'Blog post updated successfully' });
    } catch (error: any) {
      if (error.code === '23505') {
        next(new AppError('A blog post with this slug already exists', 409, 'DUPLICATE_SLUG'));
        return;
      }
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const deleted = await blogRepository.delete(req.params.id);
      if (!deleted) {
        throw new AppError('Blog post not found', 404, 'NOT_FOUND');
      }
      res.status(200).json({ success: true, message: 'Blog post deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async togglePublish(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { isPublished } = req.body;
      const updated = await blogRepository.togglePublish(req.params.id, isPublished);
      if (!updated) {
        throw new AppError('Blog post not found', 404, 'NOT_FOUND');
      }
      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }
}

export const blogController = new BlogController();

