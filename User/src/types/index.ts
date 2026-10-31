export interface SiteSettings {
  id?: string;
  fullName: string;
  title: string;
  tagline: string;
  bio: string;
  avatarUrl: string | null;
  resumeUrl: string | null;
  contactEmail: string;
  contactPhone: string | null;
  location: string | null;
  primaryAccent: string;
  seoTitle: string | null;
  seoDescription: string | null;
  updatedAt?: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  iconKey: string;
  displayOrder: number;
  isVisible: boolean;
}

export interface SkillCategory {
  id: string;
  name: string;
  displayOrder: number;
  isVisible: boolean;
  skills: Skill[];
}

export interface Skill {
  id: string;
  categoryId: string;
  name: string;
  proficiencyPercentage: number;
  iconKey: string | null;
  displayOrder: number;
  isVisible: boolean;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  location: string | null;
  employmentType: string | null;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  description: string | null;
  achievements: string[] | null;
  displayOrder: number;
  isVisible: boolean;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  thumbnailUrl: string | null;
  galleryUrls: string[] | null;
  tags: string[] | null;
  liveUrl: string | null;
  githubUrl: string | null;
  isFeatured: boolean;
  displayOrder: number;
  isVisible: boolean;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string | null;
  tags: string[] | null;
  readingTimeMinutes: number;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string | null;
  grade: string | null;
  description: string | null;
  displayOrder: number;
  isVisible: boolean;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  credentialUrl: string | null;
  certificateImageUrl: string | null;
  displayOrder: number;
  isVisible: boolean;
}

export interface Testimonial {
  id: string;
  authorName: string;
  authorRole: string;
  authorCompany: string | null;
  avatarUrl: string | null;
  quote: string;
  rating: number;
  displayOrder: number;
  isVisible: boolean;
}

export interface PortfolioData {
  settings: SiteSettings;
  socialLinks: SocialLink[];
  skillCategories: SkillCategory[];
  experiences: Experience[];
  projects: Project[];
  education: Education[];
  certifications: Certification[];
  testimonials: Testimonial[];
}

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

