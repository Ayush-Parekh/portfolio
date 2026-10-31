import { Request, Response, NextFunction } from 'express';
import { settingsRepository } from '../repositories/settings.repository.js';
import { socialRepository } from '../repositories/social.repository.js';
import { skillRepository } from '../repositories/skill.repository.js';
import { experienceRepository } from '../repositories/experience.repository.js';
import { projectRepository } from '../repositories/project.repository.js';
import { blogRepository } from '../repositories/blog.repository.js';
import { educationRepository } from '../repositories/education.repository.js';
import { certificationRepository } from '../repositories/certification.repository.js';
import { testimonialRepository } from '../repositories/testimonial.repository.js';
import { messageRepository } from '../repositories/message.repository.js';
import { mailerService } from '../services/mailer.service.js';
import { AppError } from '../middleware/error.middleware.js';

export class PublicController {
  /**
   * Consolidated Portfolio Fetch
   * Returns all visible content in a single round-trip payload optimized for first paint.
   */
  async getPortfolio(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const [
        settings,
        socialLinks,
        skillCategories,
        experiences,
        projects,
        education,
        certifications,
        testimonials,
      ] = await Promise.all([
        settingsRepository.getSettings(),
        socialRepository.findAll(false), // only visible
        skillRepository.getCategorizedSkills(false), // only visible categories & skills
        experienceRepository.findAll(false), // only visible
        projectRepository.findAll(false), // only visible
        educationRepository.findAll(false), // only visible
        certificationRepository.findAll(false), // only visible
        testimonialRepository.findAll(false), // only visible
      ]);

      res.status(200).json({
        success: true,
        data: {
          settings: settings || {
            fullName: 'Ayush Parekh',
            title: 'Creative Technologist & Full-Stack Developer',
            tagline: 'Architecting scalable systems, performant web applications, and intuitive user experiences.',
            bio: "I'm a passionate Full-Stack Developer and Computer Science undergraduate with deep proficiency in React, Node.js, Express, PostgreSQL, and modern motion design.",
            contactEmail: 'ayushwork@gmail.com',
            primaryAccent: '#e91010',
          },
          socialLinks,
          skillCategories,
          experiences,
          projects,
          education,
          certifications,
          testimonials,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * List all visible showcase projects
   */
  async getProjects(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tag = req.query.tag as string | undefined;
      let allProjects = await projectRepository.findAll(false);

      if (tag) {
        allProjects = allProjects.filter((p) =>
          p.tags?.some((t) => t.toLowerCase() === tag.toLowerCase())
        );
      }

      res.status(200).json({ success: true, data: allProjects });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Project Case Study detail by slug
   */
  async getProjectBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { slug } = req.params;
      const project = await projectRepository.findBySlug(slug);

      if (!project || !project.isVisible) {
        throw new AppError('Project not found', 404, 'NOT_FOUND');
      }

      res.status(200).json({ success: true, data: project });
    } catch (error) {
      next(error);
    }
  }

  /**
   * List published blog posts
   */
  async getBlogPosts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tag = req.query.tag as string | undefined;
      let posts = await blogRepository.findAll(false); // only published

      if (tag) {
        posts = posts.filter((p) =>
          p.tags?.some((t) => t.toLowerCase() === tag.toLowerCase())
        );
      }

      res.status(200).json({ success: true, data: posts });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Full blog article content by slug
   */
  async getBlogPostBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { slug } = req.params;
      const post = await blogRepository.findBySlug(slug);

      if (!post || !post.isPublished) {
        throw new AppError('Blog article not found', 404, 'NOT_FOUND');
      }

      res.status(200).json({ success: true, data: post });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Contact Form Submission
   * Rate limited, validates input, stores in DB, and dispatches email alert via Gmail SMTP
   */
  async submitContact(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email, subject, message } = req.body;
      const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || null;

      // 1. Persist to PostgreSQL database
      const savedMessage = await messageRepository.create({
        senderName: name,
        senderEmail: email,
        subject,
        message,
        isRead: false,
        ipAddress: typeof ipAddress === 'string' ? ipAddress.split(',')[0].trim() : null,
      });

      // 2. Trigger non-blocking async email notification via Gmail SMTP
      mailerService.sendContactNotification({ name, email, subject, message }).catch((err) => {
        console.error('Failed to dispatch background contact email notification:', err);
      });

      res.status(201).json({
        success: true,
        data: { id: savedMessage.id },
        message: 'Your message has been sent successfully. I will get back to you shortly!',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const publicController = new PublicController();

