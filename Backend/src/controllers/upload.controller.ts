import { Request, Response, NextFunction } from 'express';
import { storageService } from '../services/storage.service.js';
import { AppError } from '../middleware/error.middleware.js';

export class UploadController {
  async uploadFile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        throw new AppError('No file provided in the request', 400, 'FILE_MISSING');
      }

      const result = await storageService.uploadBuffer(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );

      res.status(201).json({
        success: true,
        data: result,
        message: 'File successfully uploaded to Cloudinary',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteFile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { publicId } = req.params;
      if (!publicId) {
        throw new AppError('publicId parameter is required', 400, 'PARAM_MISSING');
      }

      const success = await storageService.deleteMedia(publicId);
      res.status(200).json({
        success,
        message: success ? 'File successfully deleted' : 'File deletion skipped or failed',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const uploadController = new UploadController();

