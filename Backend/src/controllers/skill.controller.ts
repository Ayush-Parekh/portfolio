import { Request, Response, NextFunction } from 'express';
import { skillRepository } from '../repositories/skill.repository.js';
import { AppError } from '../middleware/error.middleware.js';

export class SkillController {
  // Categories
  async getAllCategories(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await skillRepository.findAllCategories(true);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async createCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const created = await skillRepository.createCategory(req.body);
      res.status(201).json({ success: true, data: created, message: 'Skill category created successfully' });
    } catch (error) {
      next(error);
    }
  }

  async updateCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await skillRepository.updateCategory(req.params.id, req.body);
      if (!updated) {
        throw new AppError('Category not found', 404, 'NOT_FOUND');
      }
      res.status(200).json({ success: true, data: updated, message: 'Category updated successfully' });
    } catch (error) {
      next(error);
    }
  }

  async deleteCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const deleted = await skillRepository.deleteCategory(req.params.id);
      if (!deleted) {
        throw new AppError('Category not found', 404, 'NOT_FOUND');
      }
      res.status(200).json({ success: true, message: 'Category deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async reorderCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await skillRepository.reorderCategories(req.body.items);
      res.status(200).json({ success: true, message: 'Categories reordered successfully' });
    } catch (error) {
      next(error);
    }
  }

  // Skills
  async getAllSkills(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categoryId = req.query.categoryId as string | undefined;
      const data = await skillRepository.findAllSkills(categoryId, true);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async getCategorizedSkills(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await skillRepository.getCategorizedSkills(true);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async createSkill(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const created = await skillRepository.createSkill(req.body);
      res.status(201).json({ success: true, data: created, message: 'Skill created successfully' });
    } catch (error) {
      next(error);
    }
  }

  async updateSkill(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await skillRepository.updateSkill(req.params.id, req.body);
      if (!updated) {
        throw new AppError('Skill not found', 404, 'NOT_FOUND');
      }
      res.status(200).json({ success: true, data: updated, message: 'Skill updated successfully' });
    } catch (error) {
      next(error);
    }
  }

  async deleteSkill(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const deleted = await skillRepository.deleteSkill(req.params.id);
      if (!deleted) {
        throw new AppError('Skill not found', 404, 'NOT_FOUND');
      }
      res.status(200).json({ success: true, message: 'Skill deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async reorderSkills(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await skillRepository.reorderSkills(req.body.items);
      res.status(200).json({ success: true, message: 'Skills reordered successfully' });
    } catch (error) {
      next(error);
    }
  }

  async setSkillVisibility(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await skillRepository.setSkillVisibility(req.params.id, req.body.isVisible);
      if (!updated) {
        throw new AppError('Skill not found', 404, 'NOT_FOUND');
      }
      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }
}

export const skillController = new SkillController();

