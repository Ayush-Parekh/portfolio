import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, z } from 'zod';

/**
 * Generic request body validation middleware factory using Zod.
 */
export const validateBody = (schema: AnyZodObject) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Generic request query parameters validation middleware factory using Zod.
 */
export const validateQuery = (schema: AnyZodObject) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      req.query = await schema.parseAsync(req.query);
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Generic route params validation middleware factory using Zod.
 */
export const validateParams = (schema: AnyZodObject) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      req.params = await schema.parseAsync(req.params);
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Common Zod Schemas
 */
export const idParamSchema = z.object({
  id: z.string().uuid('Invalid ID format. Must be a valid UUID.'),
});

export const slugParamSchema = z.object({
  slug: z.string().min(1, 'Slug parameter is required'),
});

export const visibilitySchema = z.object({
  isVisible: z.boolean(),
});

export const reorderSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().uuid(),
      displayOrder: z.number().int().min(0),
    })
  ).min(1, 'At least one item is required for reordering'),
});

export const loginSchema = z.object({
  email: z.string().email('Valid email address is required'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const contactMessageSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long').max(100),
  email: z.string().email('Please provide a valid email address'),
  subject: z.string().min(2, 'Subject must be at least 2 characters long').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters long').max(5000),
});

/**
 * Site Settings Schema
 */
export const updateSettingsSchema = z.object({
  fullName: z.string().min(1).max(255).optional(),
  title: z.string().min(1).max(255).optional(),
  tagline: z.string().min(1).max(255).optional(),
  bio: z.string().min(1).optional(),
  avatarUrl: z.string().url().nullable().optional(),
  resumeUrl: z.string().url().nullable().optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().max(50).nullable().optional(),
  location: z.string().max(255).nullable().optional(),
  primaryAccent: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'Invalid hex color').optional(),
  seoTitle: z.string().max(255).nullable().optional(),
  seoDescription: z.string().nullable().optional(),
});

/**
 * Projects Schemas
 */
export const createProjectSchema = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be URL-safe kebab-case'),
  summary: z.string().min(5),
  description: z.string().min(10),
  thumbnailUrl: z.string().url().nullable().optional(),
  galleryUrls: z.array(z.string().url()).optional(),
  tags: z.array(z.string()).optional(),
  liveUrl: z.string().url().nullable().optional(),
  githubUrl: z.string().url().nullable().optional(),
  isFeatured: z.boolean().default(false),
  displayOrder: z.number().int().min(0).default(0),
  isVisible: z.boolean().default(true),
});

export const updateProjectSchema = createProjectSchema.partial();

/**
 * Blog Posts Schemas
 */
export const createBlogSchema = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be URL-safe kebab-case'),
  excerpt: z.string().min(5),
  content: z.string().min(10),
  coverImageUrl: z.string().url().nullable().optional(),
  tags: z.array(z.string()).optional(),
  readingTimeMinutes: z.number().int().min(1).default(5),
  isPublished: z.boolean().default(true),
});

export const updateBlogSchema = createBlogSchema.partial();

/**
 * Skill Categories & Skills Schemas
 */
export const createCategorySchema = z.object({
  name: z.string().min(1).max(100),
  displayOrder: z.number().int().min(0).default(0),
  isVisible: z.boolean().default(true),
});

export const updateCategorySchema = createCategorySchema.partial();

export const createSkillSchema = z.object({
  categoryId: z.string().uuid(),
  name: z.string().min(1).max(100),
  proficiencyPercentage: z.number().int().min(0).max(100).default(80),
  iconKey: z.string().max(100).nullable().optional(),
  displayOrder: z.number().int().min(0).default(0),
  isVisible: z.boolean().default(true),
});

export const updateSkillSchema = createSkillSchema.partial();

/**
 * Experience Schemas
 */
export const createExperienceSchema = z.object({
  company: z.string().min(1).max(255),
  role: z.string().min(1).max(255),
  location: z.string().max(255).nullable().optional(),
  employmentType: z.string().max(100).nullable().optional(),
  startDate: z.string().min(1).max(100),
  endDate: z.string().max(100).nullable().optional(),
  isCurrent: z.boolean().default(false),
  description: z.string().nullable().optional(),
  achievements: z.array(z.string()).optional(),
  displayOrder: z.number().int().min(0).default(0),
  isVisible: z.boolean().default(true),
});

export const updateExperienceSchema = createExperienceSchema.partial();

/**
 * Education Schemas
 */
export const createEducationSchema = z.object({
  institution: z.string().min(1).max(255),
  degree: z.string().min(1).max(255),
  fieldOfStudy: z.string().min(1).max(255),
  startDate: z.string().min(1).max(100),
  endDate: z.string().max(100).nullable().optional(),
  grade: z.string().max(50).nullable().optional(),
  description: z.string().nullable().optional(),
  displayOrder: z.number().int().min(0).default(0),
  isVisible: z.boolean().default(true),
});

export const updateEducationSchema = createEducationSchema.partial();

/**
 * Certification Schemas
 */
export const createCertificationSchema = z.object({
  name: z.string().min(1).max(255),
  issuer: z.string().min(1).max(255),
  issueDate: z.string().min(1).max(100),
  credentialUrl: z.string().url().nullable().optional(),
  certificateImageUrl: z.string().url().nullable().optional(),
  displayOrder: z.number().int().min(0).default(0),
  isVisible: z.boolean().default(true),
});

export const updateCertificationSchema = createCertificationSchema.partial();

/**
 * Testimonial Schemas
 */
export const createTestimonialSchema = z.object({
  authorName: z.string().min(1).max(255),
  authorRole: z.string().min(1).max(255),
  authorCompany: z.string().max(255).nullable().optional(),
  avatarUrl: z.string().url().nullable().optional(),
  quote: z.string().min(5),
  rating: z.number().int().min(1).max(5).default(5),
  displayOrder: z.number().int().min(0).default(0),
  isVisible: z.boolean().default(true),
});

export const updateTestimonialSchema = createTestimonialSchema.partial();

/**
 * Social Links Schemas
 */
export const createSocialSchema = z.object({
  platform: z.string().min(1).max(100),
  url: z.string().url(),
  iconKey: z.string().min(1).max(100),
  displayOrder: z.number().int().min(0).default(0),
  isVisible: z.boolean().default(true),
});

export const updateSocialSchema = createSocialSchema.partial();


