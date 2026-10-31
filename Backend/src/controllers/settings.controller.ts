import { Request, Response, NextFunction } from 'express';
import { settingsRepository } from '../repositories/settings.repository.js';
import { AppError } from '../middleware/error.middleware.js';

export class SettingsController {
  async getSettings(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const settings = await settingsRepository.getSettings();
      if (!settings) {
        throw new AppError('Site settings not initialized', 404, 'SETTINGS_NOT_FOUND');
      }
      res.status(200).json({ success: true, data: settings });
    } catch (error) {
      next(error);
    }
  }

  async updateSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await settingsRepository.updateSettings(req.body);
      res.status(200).json({
        success: true,
        data: updated,
        message: 'Site settings updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const settingsController = new SettingsController();

