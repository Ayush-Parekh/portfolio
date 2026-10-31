import {
  PortfolioData,
  Project,
  BlogPost,
  ContactPayload,
} from '../types/index.js';

class PublicApiClient {
  private apiBase = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.apiBase}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      const errorMsg = data?.error?.message || `Request failed with status ${response.status}`;
      throw new Error(errorMsg);
    }

    return data.data as T;
  }

  // 1. Consolidated Portfolio (Hero, About, Skills, Experience, Projects, Education, Certifications, Testimonials)
  async getPortfolio(): Promise<PortfolioData> {
    return this.request('/public/portfolio');
  }

  // 2. Showcase Projects
  async getProjects(tag?: string): Promise<Project[]> {
    const query = tag ? `?tag=${encodeURIComponent(tag)}` : '';
    return this.request(`/public/projects${query}`);
  }

  async getProjectBySlug(slug: string): Promise<Project> {
    return this.request(`/public/projects/${encodeURIComponent(slug)}`);
  }

  // 3. Technical Blog Posts
  async getBlogPosts(tag?: string): Promise<BlogPost[]> {
    const query = tag ? `?tag=${encodeURIComponent(tag)}` : '';
    return this.request(`/public/blog${query}`);
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost> {
    return this.request(`/public/blog/${encodeURIComponent(slug)}`);
  }

  // 4. Contact Form Submission
  async submitContact(payload: ContactPayload): Promise<{ id: string }> {
    return this.request('/public/contact', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
}

export const publicApi = new PublicApiClient();

