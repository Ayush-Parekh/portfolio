import { pgTable, uuid, varchar, text, integer, boolean, timestamp, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

/**
 * 1. Admin Users Table
 * Single-admin credential storage with bcrypt password hash.
 */
export const adminUsers = pgTable(
  'admin_users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    fullName: varchar('full_name', { length: 255 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('admin_users_email_idx').on(table.email),
  ]
);

/**
 * 2. Site Settings Singleton Table
 * Stores overall portfolio presentation attributes, SEO tags, and resume links.
 */
export const siteSettings = pgTable('site_settings', {
  id: uuid('id').defaultRandom().primaryKey(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  tagline: varchar('tagline', { length: 255 }).notNull(),
  bio: text('bio').notNull(),
  avatarUrl: text('avatar_url'),
  resumeUrl: text('resume_url'),
  contactEmail: varchar('contact_email', { length: 255 }).notNull(),
  contactPhone: varchar('contact_phone', { length: 50 }),
  location: varchar('location', { length: 255 }),
  primaryAccent: varchar('primary_accent', { length: 50 }).default('#e91010').notNull(),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

/**
 * 3. Social Links Table
 * Platform links displayed in Hero, Contact, and Footer.
 */
export const socialLinks = pgTable(
  'social_links',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    platform: varchar('platform', { length: 100 }).notNull(),
    url: text('url').notNull(),
    iconKey: varchar('icon_key', { length: 100 }).notNull(),
    displayOrder: integer('display_order').default(0).notNull(),
    isVisible: boolean('is_visible').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('social_links_order_idx').on(table.displayOrder),
    index('social_links_visible_idx').on(table.isVisible),
  ]
);

/**
 * 4. Skill Categories Table
 * Organizes technical skills into logical groups (e.g. Frontend, Backend, Tools).
 */
export const skillCategories = pgTable(
  'skill_categories',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 100 }).notNull().unique(),
    displayOrder: integer('display_order').default(0).notNull(),
    isVisible: boolean('is_visible').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('skill_categories_order_idx').on(table.displayOrder),
  ]
);

/**
 * 5. Skills Table
 * Individual technical competencies with proficiency percentage.
 */
export const skills = pgTable(
  'skills',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    categoryId: uuid('category_id')
      .notNull()
      .references(() => skillCategories.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 100 }).notNull(),
    proficiencyPercentage: integer('proficiency_percentage').default(85).notNull(),
    iconKey: varchar('icon_key', { length: 100 }),
    displayOrder: integer('display_order').default(0).notNull(),
    isVisible: boolean('is_visible').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('skills_category_id_idx').on(table.categoryId),
    index('skills_order_idx').on(table.displayOrder),
    index('skills_visible_idx').on(table.isVisible),
  ]
);

/**
 * 6. Experiences Table
 * Professional timeline entries with achievements.
 */
export const experiences = pgTable(
  'experiences',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    company: varchar('company', { length: 255 }).notNull(),
    role: varchar('role', { length: 255 }).notNull(),
    location: varchar('location', { length: 255 }),
    employmentType: varchar('employment_type', { length: 100 }),
    startDate: varchar('start_date', { length: 100 }).notNull(),
    endDate: varchar('end_date', { length: 100 }),
    isCurrent: boolean('is_current').default(false).notNull(),
    description: text('description'),
    achievements: text('achievements').array(),
    displayOrder: integer('display_order').default(0).notNull(),
    isVisible: boolean('is_visible').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('experiences_order_idx').on(table.displayOrder),
    index('experiences_visible_idx').on(table.isVisible),
  ]
);

/**
 * 7. Projects Table
 * Showcase projects with tags, gallery, links, and dedicated slug routing.
 */
export const projects = pgTable(
  'projects',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    summary: text('summary').notNull(),
    description: text('description').notNull(),
    thumbnailUrl: text('thumbnail_url'),
    galleryUrls: text('gallery_urls').array(),
    tags: text('tags').array(),
    liveUrl: text('live_url'),
    githubUrl: text('github_url'),
    isFeatured: boolean('is_featured').default(false).notNull(),
    displayOrder: integer('display_order').default(0).notNull(),
    isVisible: boolean('is_visible').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('projects_slug_idx').on(table.slug),
    index('projects_order_idx').on(table.displayOrder),
    index('projects_visible_idx').on(table.isVisible),
  ]
);

/**
 * 8. Blog Posts Table
 * Articles and technical deep dives with markdown body.
 */
export const blogPosts = pgTable(
  'blog_posts',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    excerpt: text('excerpt').notNull(),
    content: text('content').notNull(),
    coverImageUrl: text('cover_image_url'),
    tags: text('tags').array(),
    readingTimeMinutes: integer('reading_time_minutes').default(5).notNull(),
    isPublished: boolean('is_published').default(true).notNull(),
    publishedAt: timestamp('published_at', { withTimezone: true }).defaultNow(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('blog_posts_slug_idx').on(table.slug),
    index('blog_posts_published_idx').on(table.isPublished),
  ]
);

/**
 * 9. Education Table
 * Academic qualifications and bootcamps.
 */
export const education = pgTable(
  'education',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    institution: varchar('institution', { length: 255 }).notNull(),
    degree: varchar('degree', { length: 255 }).notNull(),
    fieldOfStudy: varchar('field_of_study', { length: 255 }).notNull(),
    startDate: varchar('start_date', { length: 100 }).notNull(),
    endDate: varchar('end_date', { length: 100 }),
    grade: varchar('grade', { length: 50 }),
    description: text('description'),
    displayOrder: integer('display_order').default(0).notNull(),
    isVisible: boolean('is_visible').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('education_order_idx').on(table.displayOrder),
    index('education_visible_idx').on(table.isVisible),
  ]
);

/**
 * 10. Certifications Table
 * Verifiable professional credentials and certificates.
 */
export const certifications = pgTable(
  'certifications',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    issuer: varchar('issuer', { length: 255 }).notNull(),
    issueDate: varchar('issue_date', { length: 100 }).notNull(),
    credentialUrl: text('credential_url'),
    certificateImageUrl: text('certificate_image_url'),
    displayOrder: integer('display_order').default(0).notNull(),
    isVisible: boolean('is_visible').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('certifications_order_idx').on(table.displayOrder),
    index('certifications_visible_idx').on(table.isVisible),
  ]
);

/**
 * 11. Testimonials Table
 * Recommendations and quotes from colleagues and clients.
 */
export const testimonials = pgTable(
  'testimonials',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    authorName: varchar('author_name', { length: 255 }).notNull(),
    authorRole: varchar('author_role', { length: 255 }).notNull(),
    authorCompany: varchar('author_company', { length: 255 }),
    avatarUrl: text('avatar_url'),
    quote: text('quote').notNull(),
    rating: integer('rating').default(5).notNull(),
    displayOrder: integer('display_order').default(0).notNull(),
    isVisible: boolean('is_visible').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('testimonials_order_idx').on(table.displayOrder),
    index('testimonials_visible_idx').on(table.isVisible),
  ]
);

/**
 * 12. Messages Table
 * Inbound inquiries sent via public contact form.
 */
export const messages = pgTable(
  'messages',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    senderName: varchar('sender_name', { length: 255 }).notNull(),
    senderEmail: varchar('sender_email', { length: 255 }).notNull(),
    subject: varchar('subject', { length: 255 }).notNull(),
    message: text('message').notNull(),
    isRead: boolean('is_read').default(false).notNull(),
    ipAddress: varchar('ip_address', { length: 100 }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('messages_is_read_idx').on(table.isRead),
    index('messages_created_at_idx').on(table.createdAt),
  ]
);

/**
 * 13. Media Table
 * Tracks assets uploaded to Cloudinary.
 */
export const media = pgTable(
  'media',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    publicId: varchar('public_id', { length: 255 }).notNull().unique(),
    originalName: varchar('original_name', { length: 255 }).notNull(),
    mimeType: varchar('mime_type', { length: 100 }).notNull(),
    fileSizeBytes: integer('file_size_bytes').notNull(),
    secureUrl: text('secure_url').notNull(),
    resourceType: varchar('resource_type', { length: 50 }).default('image').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('media_public_id_idx').on(table.publicId),
  ]
);

/**
 * Drizzle Relationships
 */
export const skillCategoriesRelations = relations(skillCategories, ({ many }) => ({
  skills: many(skills),
}));

export const skillsRelations = relations(skills, ({ one }) => ({
  category: one(skillCategories, {
    fields: [skills.categoryId],
    references: [skillCategories.id],
  }),
}));

