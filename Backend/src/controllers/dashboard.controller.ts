import { Request, Response, NextFunction } from 'express';
import { projectRepository } from '../repositories/project.repository.js';
import { blogRepository } from '../repositories/blog.repository.js';
import { skillRepository } from '../repositories/skill.repository.js';
import { experienceRepository } from '../repositories/experience.repository.js';
import { messageRepository } from '../repositories/message.repository.js';

export class DashboardController {
  async getStats(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const [allProjects, allBlogs, allSkills, allExp, unreadCount] = await Promise.all([
        projectRepository.findAll(true),
        blogRepository.findAll(true),
        skillRepository.findAllSkills(undefined, true),
        experienceRepository.findAll(true),
        messageRepository.countUnread(),
      ]);

      res.status(200).json({
        success: true,
        data: {
          projectCount: allProjects.length,
          blogCount: allBlogs.length,
          skillCount: allSkills.length,
          experienceCount: allExp.length,
          unreadMessages: unreadCount,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export const dashboardController = new DashboardController();

