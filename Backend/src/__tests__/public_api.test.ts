import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../app.js';
import { settingsRepository } from '../repositories/settings.repository.js';
import { socialRepository } from '../repositories/social.repository.js';
import { skillRepository } from '../repositories/skill.repository.js';
import { experienceRepository } from '../repositories/experience.repository.js';
import { projectRepository } from '../repositories/project.repository.js';
import { educationRepository } from '../repositories/education.repository.js';
import { certificationRepository } from '../repositories/certification.repository.js';
import { testimonialRepository } from '../repositories/testimonial.repository.js';
import { messageRepository } from '../repositories/message.repository.js';
import { blogRepository } from '../repositories/blog.repository.js';
import { mailerService } from '../services/mailer.service.js';

describe('Public Portfolio REST API', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('GET /api/public/portfolio', () => {
    it('should return aggregated portfolio structure', async () => {
      vi.spyOn(settingsRepository, 'getSettings').mockResolvedValue({
        id: '123e4567-e89b-12d3-a456-426614174000',
        fullName: 'Ayush Parekh',
        title: 'Creative Technologist',
        tagline: 'Building modern apps',
        bio: 'Developer bio',
        avatarUrl: null,
        resumeUrl: null,
        contactEmail: 'ayushwork@gmail.com',
        contactPhone: null,
        location: 'Gandhinagar',
        primaryAccent: '#e91010',
        seoTitle: null,
        seoDescription: null,
        updatedAt: new Date(),
      } as any);

      vi.spyOn(socialRepository, 'findAll').mockResolvedValue([]);
      vi.spyOn(skillRepository, 'getCategorizedSkills').mockResolvedValue([]);
      vi.spyOn(experienceRepository, 'findAll').mockResolvedValue([]);
      vi.spyOn(projectRepository, 'findAll').mockResolvedValue([]);
      vi.spyOn(educationRepository, 'findAll').mockResolvedValue([]);
      vi.spyOn(certificationRepository, 'findAll').mockResolvedValue([]);
      vi.spyOn(testimonialRepository, 'findAll').mockResolvedValue([]);

      const res = await request(app).get('/api/public/portfolio');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('settings');
      expect(res.body.data.settings.fullName).toBe('Ayush Parekh');
      expect(res.body.data).toHaveProperty('socialLinks');
      expect(res.body.data).toHaveProperty('skillCategories');
      expect(res.body.data).toHaveProperty('experiences');
      expect(res.body.data).toHaveProperty('projects');
      expect(res.body.data).toHaveProperty('education');
      expect(res.body.data).toHaveProperty('certifications');
      expect(res.body.data).toHaveProperty('testimonials');
    });
  });

  describe('GET /api/public/projects/:slug', () => {
    it('should return 404 when project slug does not exist', async () => {
      vi.spyOn(projectRepository, 'findBySlug').mockResolvedValue(null as any);

      const res = await request(app).get('/api/public/projects/non-existent-project');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });

    it('should return project data when slug exists and is visible', async () => {
      const mockProject = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Dynamic Portfolio',
        slug: 'dynamic-portfolio',
        summary: 'A fast portfolio web app',
        description: 'Complete case study',
        isVisible: true,
      };
      vi.spyOn(projectRepository, 'findBySlug').mockResolvedValue(mockProject as any);

      const res = await request(app).get('/api/public/projects/dynamic-portfolio');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.slug).toBe('dynamic-portfolio');
    });
  });

  describe('GET /api/public/blog/:slug', () => {
    it('should return 404 when blog slug does not exist', async () => {
      vi.spyOn(blogRepository, 'findBySlug').mockResolvedValue(null as any);

      const res = await request(app).get('/api/public/blog/non-existent-article');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('POST /api/public/contact', () => {
    it('should reject submission with missing or invalid email', async () => {
      const res = await request(app)
        .post('/api/public/contact')
        .send({
          name: 'Jane Doe',
          email: 'invalid-email',
          subject: 'Hi',
          message: 'Short',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should persist valid message and trigger email alert', async () => {
      vi.spyOn(messageRepository, 'create').mockResolvedValue({
        id: '123e4567-e89b-12d3-a456-426614174000',
        senderName: 'Jane Doe',
        senderEmail: 'jane@example.com',
        subject: 'Project Collaboration Opportunity',
        message: 'Hello Ayush, we would love to collaborate on a full-stack project.',
        isRead: false,
        ipAddress: '127.0.0.1',
        createdAt: new Date(),
      } as any);

      const mailSpy = vi
        .spyOn(mailerService, 'sendContactNotification')
        .mockResolvedValue(true);

      const res = await request(app)
        .post('/api/public/contact')
        .send({
          name: 'Jane Doe',
          email: 'jane@example.com',
          subject: 'Project Collaboration Opportunity',
          message: 'Hello Ayush, we would love to collaborate on a full-stack project.',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      expect(mailSpy).toHaveBeenCalled();
    });
  });
});
