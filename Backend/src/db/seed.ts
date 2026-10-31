import bcrypt from 'bcryptjs';
import { db, pool } from '../config/db.js';
import { env } from '../config/env.js';
import {
  adminUsers,
  siteSettings,
  socialLinks,
  skillCategories,
  skills,
  experiences,
  projects,
  blogPosts,
  education,
  certifications,
} from './schema.js';
import { eq } from 'drizzle-orm';

/**
 * Seed script initializing the database with the admin user and Ayush's real-world portfolio data.
 */
async function seedDatabase() {
  console.log('🌱 Starting database seed operation...');

  try {
    // 1. Seed Admin User
    const existingAdmin = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, env.ADMIN_EMAIL))
      .limit(1);

    if (existingAdmin.length === 0) {
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, salt);

      await db.insert(adminUsers).values({
        email: env.ADMIN_EMAIL,
        passwordHash,
        fullName: env.ADMIN_NAME,
      });
      console.log(`👤 Admin user seeded: ${env.ADMIN_EMAIL}`);
    } else {
      console.log(`ℹ️ Admin user already exists: ${env.ADMIN_EMAIL}`);
    }

    // 2. Seed Site Settings
    const existingSettings = await db.select().from(siteSettings).limit(1);
    if (existingSettings.length === 0) {
      await db.insert(siteSettings).values({
        fullName: 'Ayush Parekh',
        title: 'Creative Technologist & Full-Stack Developer',
        tagline: 'Architecting scalable systems, performant web applications, and intuitive user experiences.',
        bio: "I'm a passionate Full-Stack Developer and Computer Science undergraduate with deep proficiency in React, Node.js, Express, PostgreSQL, and modern motion design. I engineer secure, high-speed, and responsive applications with clean, modular architecture.",
        contactEmail: 'ayushwork@gmail.com',
        contactPhone: '+91 7567633863',
        location: 'Gandhinagar, Gujarat, India',
        primaryAccent: '#e91010',
        seoTitle: 'Ayush Parekh | Creative Technologist & Full-Stack Developer',
        seoDescription: 'Personal portfolio of Ayush Parekh showcasing dynamic web applications, engineering projects, skills, and technical articles.',
      });
      console.log('⚙️ Site settings initialized.');
    }

    // 3. Seed Social Links
    const existingSocials = await db.select().from(socialLinks).limit(1);
    if (existingSocials.length === 0) {
      await db.insert(socialLinks).values([
        {
          platform: 'GitHub',
          url: 'https://github.com/Ayush-Parekh',
          iconKey: 'github',
          displayOrder: 1,
          isVisible: true,
        },
        {
          platform: 'LinkedIn',
          url: 'https://www.linkedin.com/in/ayush-parekh-90a24a259/',
          iconKey: 'linkedin',
          displayOrder: 2,
          isVisible: true,
        },
        {
          platform: 'Email',
          url: 'mailto:ayushwork@gmail.com',
          iconKey: 'mail',
          displayOrder: 3,
          isVisible: true,
        },
      ]);
      console.log('🔗 Social links initialized.');
    }

    // 4. Seed Skill Categories & Skills
    const existingCategories = await db.select().from(skillCategories).limit(1);
    if (existingCategories.length === 0) {
      const [frontendCat] = await db
        .insert(skillCategories)
        .values({ name: 'Frontend Engineering', displayOrder: 1, isVisible: true })
        .returning();

      const [backendCat] = await db
        .insert(skillCategories)
        .values({ name: 'Backend & APIs', displayOrder: 2, isVisible: true })
        .returning();

      const [dbCat] = await db
        .insert(skillCategories)
        .values({ name: 'Databases & Cloud', displayOrder: 3, isVisible: true })
        .returning();

      const [toolsCat] = await db
        .insert(skillCategories)
        .values({ name: 'Tools & DevOps', displayOrder: 4, isVisible: true })
        .returning();

      // Insert Skills
      await db.insert(skills).values([
        // Frontend
        { categoryId: frontendCat.id, name: 'React.js / Vite', proficiencyPercentage: 92, iconKey: 'react', displayOrder: 1 },
        { categoryId: frontendCat.id, name: 'TypeScript', proficiencyPercentage: 88, iconKey: 'typescript', displayOrder: 2 },
        { categoryId: frontendCat.id, name: 'Tailwind CSS', proficiencyPercentage: 95, iconKey: 'tailwind', displayOrder: 3 },
        { categoryId: frontendCat.id, name: 'Framer Motion & Lenis', proficiencyPercentage: 85, iconKey: 'framer', displayOrder: 4 },
        // Backend
        { categoryId: backendCat.id, name: 'Node.js & Express', proficiencyPercentage: 90, iconKey: 'nodejs', displayOrder: 1 },
        { categoryId: backendCat.id, name: 'RESTful API Architecture', proficiencyPercentage: 92, iconKey: 'api', displayOrder: 2 },
        { categoryId: backendCat.id, name: 'Authentication (JWT / OAuth)', proficiencyPercentage: 88, iconKey: 'shield', displayOrder: 3 },
        // Databases
        { categoryId: dbCat.id, name: 'PostgreSQL', proficiencyPercentage: 86, iconKey: 'postgresql', displayOrder: 1 },
        { categoryId: dbCat.id, name: 'Drizzle ORM', proficiencyPercentage: 88, iconKey: 'drizzle', displayOrder: 2 },
        { categoryId: dbCat.id, name: 'Neon Serverless', proficiencyPercentage: 85, iconKey: 'database', displayOrder: 3 },
        // Tools & DevOps
        { categoryId: toolsCat.id, name: 'Git & GitHub', proficiencyPercentage: 92, iconKey: 'git', displayOrder: 1 },
        { categoryId: toolsCat.id, name: 'Docker Containers', proficiencyPercentage: 80, iconKey: 'docker', displayOrder: 2 },
        { categoryId: toolsCat.id, name: 'Vercel Deployment', proficiencyPercentage: 90, iconKey: 'cloud', displayOrder: 3 },
      ]);
      console.log('⚡ Skill categories and individual skills initialized.');
    }

    // 5. Seed Experience
    const existingExp = await db.select().from(experiences).limit(1);
    if (existingExp.length === 0) {
      await db.insert(experiences).values([
        {
          company: 'Tech Solutions Inc.',
          role: 'Full-Stack Developer Intern',
          location: 'Gandhinagar, Gujarat',
          employmentType: 'Internship',
          startDate: 'Jan 2024',
          endDate: 'Present',
          isCurrent: true,
          description: 'Engineered responsive web applications and REST APIs using React, Node.js, and PostgreSQL.',
          achievements: [
            'Architected reusable React component libraries accelerating frontend velocity by 30%.',
            'Designed optimized PostgreSQL schemas and implemented parameterized Express query services.',
            'Collaborated with senior engineers to implement JWT cookie authentication and strict role-based access.',
          ],
          displayOrder: 1,
          isVisible: true,
        },
      ]);
      console.log('💼 Experience milestones initialized.');
    }

    // 6. Seed Projects
    const existingProjects = await db.select().from(projects).limit(1);
    if (existingProjects.length === 0) {
      await db.insert(projects).values([
        {
          title: 'Dynamic Portfolio Platform',
          slug: 'dynamic-portfolio-platform',
          summary: 'Two-panel portfolio system featuring public scroll animations, Lenis motion, and complete admin dashboard content management.',
          description: 'A production-grade, two-panel portfolio web application built with React, Vite, Express, Drizzle ORM, and PostgreSQL. Every visible content element is fully dynamic and managed from an authenticated admin console with Cloudinary media streaming.',
          tags: ['React', 'Node.js', 'Express', 'Drizzle ORM', 'PostgreSQL', 'Tailwind CSS', 'Framer Motion'],
          githubUrl: 'https://github.com/Ayush-Parekh/portfolio',
          isFeatured: true,
          displayOrder: 1,
          isVisible: true,
        },
        {
          title: 'E-Commerce Marketplace',
          slug: 'ecommerce-marketplace',
          summary: 'Scalable multi-vendor e-commerce platform with stripe checkout, inventory management, and real-time order tracking.',
          description: 'Architected with React, Node.js, and PostgreSQL with atomic transactions for inventory reservation, secure webhooks, and responsive client catalog.',
          tags: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Tailwind CSS'],
          githubUrl: 'https://github.com/Ayush-Parekh',
          isFeatured: true,
          displayOrder: 2,
          isVisible: true,
        },
      ]);
      console.log('🚀 Showcase projects initialized.');
    }

    // 7. Seed Blog Posts
    const existingBlog = await db.select().from(blogPosts).limit(1);
    if (existingBlog.length === 0) {
      await db.insert(blogPosts).values([
        {
          title: 'Architecting a Zero-Cost Full-Stack Web App with Vercel and Neon',
          slug: 'architecting-zero-cost-full-stack-web-app',
          excerpt: 'How to structure Node.js, Express, and Drizzle ORM to run serverless on Vercel Fluid Compute with Neon PostgreSQL while preserving VPS portability.',
          content: `## Introduction
Building modern full-stack web applications often confronts developers with a dilemma: choose a serverless framework that locks you into a specific platform, or maintain dedicated VPS containers that cost money from day one.

In this deep dive, we explore how to design an Express REST API with Drizzle ORM that deploys with **zero overhead on Vercel Serverless**, while maintaining full portability to run on any Linux Docker container.

### Key Architectural Pillars
1. **Stateless Express Architecture:** Separating the application initialization from the HTTP listener.
2. **Drizzle ORM over Prisma:** Eliminating heavyweight binary query engines to achieve sub-millisecond cold starts.
3. **Connection Pooling with Neon:** Utilizing serverless connection poolers to prevent exhausting PostgreSQL connection limits.
4. **Direct Cloudinary Memory Streaming:** Streaming files in-memory without relying on an ephemeral disk.`,
          tags: ['Architecture', 'Node.js', 'Drizzle ORM', 'Serverless', 'PostgreSQL'],
          readingTimeMinutes: 6,
          isPublished: true,
        },
      ]);
      console.log('✍️ Initial blog post initialized.');
    }

    // 8. Seed Education
    const existingEdu = await db.select().from(education).limit(1);
    if (existingEdu.length === 0) {
      await db.insert(education).values([
        {
          institution: 'Gujarat Technological University (GTU)',
          degree: 'Bachelor of Engineering (B.E.)',
          fieldOfStudy: 'Computer Science and Engineering',
          startDate: '2022',
          endDate: '2026',
          grade: 'Current Student',
          description: 'Specializing in software engineering, database management systems, data structures, and computer networks.',
          displayOrder: 1,
          isVisible: true,
        },
      ]);
      console.log('🎓 Education background initialized.');
    }

    // 9. Seed Certifications
    const existingCerts = await db.select().from(certifications).limit(1);
    if (existingCerts.length === 0) {
      await db.insert(certifications).values([
        {
          name: 'Full-Stack Web Development Specialization',
          issuer: 'Code Academy / Udemy',
          issueDate: '2024',
          credentialUrl: 'https://github.com/Ayush-Parekh',
          displayOrder: 1,
          isVisible: true,
        },
      ]);
      console.log('📜 Certifications initialized.');
    }

    console.log('🎉 Database seeding completed successfully!');
  } catch (err) {
    console.error('❌ Database seeding failed:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seedDatabase();

