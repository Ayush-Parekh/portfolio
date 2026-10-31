import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
import {
  validateBody,
  validateParams,
  idParamSchema,
  reorderSchema,
  visibilitySchema,
  updateSettingsSchema,
  createProjectSchema,
  updateProjectSchema,
  createBlogSchema,
  updateBlogSchema,
  createCategorySchema,
  updateCategorySchema,
  createSkillSchema,
  updateSkillSchema,
  createExperienceSchema,
  updateExperienceSchema,
  createEducationSchema,
  updateEducationSchema,
  createCertificationSchema,
  updateCertificationSchema,
  createTestimonialSchema,
  updateTestimonialSchema,
  createSocialSchema,
  updateSocialSchema,
} from '../validators/index.js';

import { dashboardController } from '../controllers/dashboard.controller.js';
import { settingsController } from '../controllers/settings.controller.js';
import { uploadController } from '../controllers/upload.controller.js';
import { messageController } from '../controllers/message.controller.js';
import { projectController } from '../controllers/project.controller.js';
import { blogController } from '../controllers/blog.controller.js';
import { skillController } from '../controllers/skill.controller.js';
import { experienceController } from '../controllers/experience.controller.js';
import { educationController } from '../controllers/education.controller.js';
import { certificationController } from '../controllers/certification.controller.js';
import { testimonialController } from '../controllers/testimonial.controller.js';
import { socialController } from '../controllers/social.controller.js';

const router = Router();

// Protect ALL admin routes with JWT Cookie Authentication
router.use(requireAuth);

/* ==========================================================================
   1. Dashboard Overview
   ========================================================================== */
router.get('/dashboard/stats', dashboardController.getStats);

/* ==========================================================================
   2. Site Settings
   ========================================================================== */
router.get('/settings', settingsController.getSettings);
router.put('/settings', validateBody(updateSettingsSchema), settingsController.updateSettings);

/* ==========================================================================
   3. Media Uploads (Cloudinary Memory Streaming)
   ========================================================================== */
router.post('/upload', upload.single('file'), uploadController.uploadFile);
router.delete('/upload/:publicId(*)', uploadController.deleteFile);

/* ==========================================================================
   4. Contact Messages Inbox
   ========================================================================== */
router.get('/messages', messageController.getAll);
router.patch('/messages/:id/read', validateParams(idParamSchema), messageController.markAsRead);
router.delete('/messages/:id', validateParams(idParamSchema), messageController.delete);

/* ==========================================================================
   5. Projects CRUD & Reorder
   ========================================================================== */
router.get('/projects', projectController.getAll);
router.get('/projects/:id', validateParams(idParamSchema), projectController.getById);
router.post('/projects', validateBody(createProjectSchema), projectController.create);
router.put('/projects/:id', validateParams(idParamSchema), validateBody(updateProjectSchema), projectController.update);
router.delete('/projects/:id', validateParams(idParamSchema), projectController.delete);
router.patch('/projects/reorder', validateBody(reorderSchema), projectController.reorder);
router.patch('/projects/:id/visibility', validateParams(idParamSchema), validateBody(visibilitySchema), projectController.setVisibility);

/* ==========================================================================
   6. Blog Posts CRUD & Publish Toggle
   ========================================================================== */
router.get('/blog', blogController.getAll);
router.get('/blog/:id', validateParams(idParamSchema), blogController.getById);
router.post('/blog', validateBody(createBlogSchema), blogController.create);
router.put('/blog/:id', validateParams(idParamSchema), validateBody(updateBlogSchema), blogController.update);
router.delete('/blog/:id', validateParams(idParamSchema), blogController.delete);
router.patch('/blog/:id/publish', validateParams(idParamSchema), blogController.togglePublish);

/* ==========================================================================
   7. Skill Categories & Skills CRUD
   ========================================================================== */
router.get('/skill-categories', skillController.getAllCategories);
router.post('/skill-categories', validateBody(createCategorySchema), skillController.createCategory);
router.put('/skill-categories/:id', validateParams(idParamSchema), validateBody(updateCategorySchema), skillController.updateCategory);
router.delete('/skill-categories/:id', validateParams(idParamSchema), skillController.deleteCategory);
router.patch('/skill-categories/reorder', validateBody(reorderSchema), skillController.reorderCategories);

router.get('/skills', skillController.getAllSkills);
router.get('/skills/categorized', skillController.getCategorizedSkills);
router.post('/skills', validateBody(createSkillSchema), skillController.createSkill);
router.put('/skills/:id', validateParams(idParamSchema), validateBody(updateSkillSchema), skillController.updateSkill);
router.delete('/skills/:id', validateParams(idParamSchema), skillController.deleteSkill);
router.patch('/skills/reorder', validateBody(reorderSchema), skillController.reorderSkills);
router.patch('/skills/:id/visibility', validateParams(idParamSchema), validateBody(visibilitySchema), skillController.setSkillVisibility);

/* ==========================================================================
   8. Experiences CRUD
   ========================================================================== */
router.get('/experiences', experienceController.getAll);
router.post('/experiences', validateBody(createExperienceSchema), experienceController.create);
router.put('/experiences/:id', validateParams(idParamSchema), validateBody(updateExperienceSchema), experienceController.update);
router.delete('/experiences/:id', validateParams(idParamSchema), experienceController.delete);
router.patch('/experiences/reorder', validateBody(reorderSchema), experienceController.reorder);
router.patch('/experiences/:id/visibility', validateParams(idParamSchema), validateBody(visibilitySchema), experienceController.setVisibility);

/* ==========================================================================
   9. Education CRUD
   ========================================================================== */
router.get('/education', educationController.getAll);
router.post('/education', validateBody(createEducationSchema), educationController.create);
router.put('/education/:id', validateParams(idParamSchema), validateBody(updateEducationSchema), educationController.update);
router.delete('/education/:id', validateParams(idParamSchema), educationController.delete);
router.patch('/education/reorder', validateBody(reorderSchema), educationController.reorder);
router.patch('/education/:id/visibility', validateParams(idParamSchema), validateBody(visibilitySchema), educationController.setVisibility);

/* ==========================================================================
   10. Certifications CRUD
   ========================================================================== */
router.get('/certifications', certificationController.getAll);
router.post('/certifications', validateBody(createCertificationSchema), certificationController.create);
router.put('/certifications/:id', validateParams(idParamSchema), validateBody(updateCertificationSchema), certificationController.update);
router.delete('/certifications/:id', validateParams(idParamSchema), certificationController.delete);
router.patch('/certifications/reorder', validateBody(reorderSchema), certificationController.reorder);
router.patch('/certifications/:id/visibility', validateParams(idParamSchema), validateBody(visibilitySchema), certificationController.setVisibility);

/* ==========================================================================
   11. Testimonials CRUD
   ========================================================================== */
router.get('/testimonials', testimonialController.getAll);
router.post('/testimonials', validateBody(createTestimonialSchema), testimonialController.create);
router.put('/testimonials/:id', validateParams(idParamSchema), validateBody(updateTestimonialSchema), testimonialController.update);
router.delete('/testimonials/:id', validateParams(idParamSchema), testimonialController.delete);
router.patch('/testimonials/reorder', validateBody(reorderSchema), testimonialController.reorder);
router.patch('/testimonials/:id/visibility', validateParams(idParamSchema), validateBody(visibilitySchema), testimonialController.setVisibility);

/* ==========================================================================
   12. Social Links CRUD
   ========================================================================== */
router.get('/social-links', socialController.getAll);
router.post('/social-links', validateBody(createSocialSchema), socialController.create);
router.put('/social-links/:id', validateParams(idParamSchema), validateBody(updateSocialSchema), socialController.update);
router.delete('/social-links/:id', validateParams(idParamSchema), socialController.delete);
router.patch('/social-links/reorder', validateBody(reorderSchema), socialController.reorder);
router.patch('/social-links/:id/visibility', validateParams(idParamSchema), validateBody(visibilitySchema), socialController.setVisibility);

export default router;

