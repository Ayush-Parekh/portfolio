import { Request, Response, NextFunction } from 'express';
import { messageRepository } from '../repositories/message.repository.js';
import { AppError } from '../middleware/error.middleware.js';

export class MessageController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
      const unreadOnly = req.query.unreadOnly === 'true';

      const data = await messageRepository.findAll(page, limit, unreadOnly);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const isRead = req.body.isRead !== undefined ? req.body.isRead : true;
      const updated = await messageRepository.markAsRead(req.params.id, isRead);
      if (!updated) {
        throw new AppError('Message not found', 404, 'NOT_FOUND');
      }
      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const deleted = await messageRepository.delete(req.params.id);
      if (!deleted) {
        throw new AppError('Message not found', 404, 'NOT_FOUND');
      }
      res.status(200).json({ success: true, message: 'Message deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

export const messageController = new MessageController();

