import { Request, Response, NextFunction } from 'express';
import { projectRepository } from '../repositories/project.repository.js';
import { AppError } from '../middleware/error.middleware.js';

export class ProjectController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const includeHidden = req.query.includeHidden === 'true' || true;
      const data = await projectRepository.findAll(includeHidden);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const item = await projectRepository.findById(req.params.id);
      if (!item) {
        throw new AppError('Project not found', 404, 'NOT_FOUND');
      }
      res.status(200).json({ success: true, data: item });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const created = await projectRepository.create(req.body);
      res.status(201).json({ success: true, data: created, message: 'Project created successfully' });
    } catch (error: any) {
      if (error.code === '23505') {
        next(new AppError('A project with this slug already exists', 409, 'DUPLICATE_SLUG'));
        return;
      }
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await projectRepository.update(req.params.id, req.body);
      if (!updated) {
        throw new AppError('Project not found', 404, 'NOT_FOUND');
      }
      res.status(200).json({ success: true, data: updated, message: 'Project updated successfully' });
    } catch (error: any) {
      if (error.code === '23505') {
        next(new AppError('A project with this slug already exists', 409, 'DUPLICATE_SLUG'));
        return;
      }
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const deleted = await projectRepository.delete(req.params.id);
      if (!deleted) {
        throw new AppError('Project not found', 404, 'NOT_FOUND');
      }
      res.status(200).json({ success: true, message: 'Project deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async reorder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await projectRepository.reorder(req.body.items);
      res.status(200).json({ success: true, message: 'Projects reordered successfully' });
    } catch (error) {
      next(error);
    }
  }

  async setVisibility(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await projectRepository.setVisibility(req.params.id, req.body.isVisible);
      if (!updated) {
        throw new AppError('Project not found', 404, 'NOT_FOUND');
      }
      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }
}

export const projectController = new ProjectController();

