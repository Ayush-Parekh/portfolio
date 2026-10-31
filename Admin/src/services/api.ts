import {
  AdminUser,
  DashboardStats,
  SiteSettings,
  Project,
  BlogPost,
  SkillCategory,
  Skill,
  Experience,
  Education,
  Certification,
  Testimonial,
  SocialLink,
  Message,
  UploadResponse,
} from '../types/index.js';

class ApiClient {
  private apiBase = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const config: RequestInit = {
      ...options,
      credentials: 'include', // Send httpOnly cookies with all requests
      headers: {
        ...(!(options.body instanceof FormData) && { 'Content-Type': 'application/json' }),
        ...options.headers,
      },
    };

    const response = await fetch(`${this.apiBase}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok || !data.success) {
      const errorMsg = data?.error?.message || `Request failed with status ${response.status}`;
      throw new Error(errorMsg);
    }

    return data.data as T;
  }

  // Auth Endpoints
  async login(credentials: { email: string; password: string }): Promise<{ user: AdminUser; token: string }> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout(): Promise<void> {
    await this.request('/auth/logout', { method: 'POST' });
  }

  async getMe(): Promise<AdminUser> {
    return this.request('/auth/me');
  }

  // Dashboard Overview
  async getDashboardStats(): Promise<DashboardStats> {
    return this.request('/admin/dashboard/stats');
  }

  // Settings
  async getSettings(): Promise<SiteSettings> {
    return this.request('/admin/settings');
  }

  async updateSettings(data: Partial<SiteSettings>): Promise<SiteSettings> {
    return this.request('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Media Uploads
  async uploadFile(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.request('/admin/upload', {
      method: 'POST',
      body: formData,
    });
  }

  async deleteFile(publicId: string): Promise<void> {
    await this.request(`/admin/upload/${encodeURIComponent(publicId)}`, {
      method: 'DELETE',
    });
  }

  // Messages Inbox
  async getMessages(page = 1, limit = 20, unreadOnly = false): Promise<{ items: Message[]; pagination: any }> {
    return this.request(`/admin/messages?page=${page}&limit=${limit}&unreadOnly=${unreadOnly}`);
  }

  async markMessageRead(id: string, isRead = true): Promise<Message> {
    return this.request(`/admin/messages/${id}/read`, {
      method: 'PATCH',
      body: JSON.stringify({ isRead }),
    });
  }

  async deleteMessage(id: string): Promise<void> {
    await this.request(`/admin/messages/${id}`, { method: 'DELETE' });
  }

  // Generic Resource Helper
  createResourceMethods<T>(resourceName: string) {
    return {
      getAll: (): Promise<T[]> => this.request(`/admin/${resourceName}`),
      getById: (id: string): Promise<T> => this.request(`/admin/${resourceName}/${id}`),
      create: (data: Partial<T>): Promise<T> =>
        this.request(`/admin/${resourceName}`, {
          method: 'POST',
          body: JSON.stringify(data),
        }),
      update: (id: string, data: Partial<T>): Promise<T> =>
        this.request(`/admin/${resourceName}/${id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        }),
      delete: (id: string): Promise<void> =>
        this.request(`/admin/${resourceName}/${id}`, {
          method: 'DELETE',
        }),
      reorder: (items: Array<{ id: string; displayOrder: number }>): Promise<void> =>
        this.request(`/admin/${resourceName}/reorder`, {
          method: 'PATCH',
          body: JSON.stringify({ items }),
        }),
      setVisibility: (id: string, isVisible: boolean): Promise<T> =>
        this.request(`/admin/${resourceName}/${id}/visibility`, {
          method: 'PATCH',
          body: JSON.stringify({ isVisible }),
        }),
    };
  }

  // Resources
  projects = this.createResourceMethods<Project>('projects');
  blog = {
    ...this.createResourceMethods<BlogPost>('blog'),
    togglePublish: (id: string, isPublished: boolean): Promise<BlogPost> =>
      this.request(`/admin/blog/${id}/publish`, {
        method: 'PATCH',
        body: JSON.stringify({ isPublished }),
      }),
  };
  skillCategories = this.createResourceMethods<SkillCategory>('skill-categories');
  skills = {
    ...this.createResourceMethods<Skill>('skills'),
    getCategorized: (): Promise<Array<SkillCategory & { skills: Skill[] }>> =>
      this.request('/admin/skills/categorized'),
  };
  experiences = this.createResourceMethods<Experience>('experiences');
  education = this.createResourceMethods<Education>('education');
  certifications = this.createResourceMethods<Certification>('certifications');
  testimonials = this.createResourceMethods<Testimonial>('testimonials');
  socialLinks = this.createResourceMethods<SocialLink>('social-links');
}

export const api = new ApiClient();

