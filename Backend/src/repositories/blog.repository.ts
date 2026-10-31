import { desc, eq } from 'drizzle-orm';
import { db } from '../config/db.js';
import { blogPosts } from '../db/schema.js';

export class BlogRepository {
  async findAll(includeUnpublished = true) {
    const query = db.select().from(blogPosts);
    if (!includeUnpublished) {
      return query.where(eq(blogPosts.isPublished, true)).orderBy(desc(blogPosts.publishedAt));
    }
    return query.orderBy(desc(blogPosts.createdAt));
  }

  async findById(id: string) {
    const results = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
    return results[0] || null;
  }

  async findBySlug(slug: string) {
    const results = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
    return results[0] || null;
  }

  async create(data: typeof blogPosts.$inferInsert) {
    const results = await db.insert(blogPosts).values(data).returning();
    return results[0];
  }

  async update(id: string, data: Partial<typeof blogPosts.$inferInsert>) {
    const results = await db
      .update(blogPosts)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(blogPosts.id, id))
      .returning();
    return results[0] || null;
  }

  async delete(id: string) {
    const results = await db.delete(blogPosts).where(eq(blogPosts.id, id)).returning();
    return results[0] || null;
  }

  async togglePublish(id: string, isPublished: boolean) {
    const results = await db
      .update(blogPosts)
      .set({
        isPublished,
        publishedAt: isPublished ? new Date() : null,
        updatedAt: new Date(),
      })
      .where(eq(blogPosts.id, id))
      .returning();
    return results[0] || null;
  }
}

export const blogRepository = new BlogRepository();

