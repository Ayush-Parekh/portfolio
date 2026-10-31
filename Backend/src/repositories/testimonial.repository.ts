import { asc, eq } from 'drizzle-orm';
import { db } from '../config/db.js';
import { testimonials } from '../db/schema.js';

export class TestimonialRepository {
  async findAll(includeHidden = true) {
    const query = db.select().from(testimonials);
    if (!includeHidden) {
      return query.where(eq(testimonials.isVisible, true)).orderBy(asc(testimonials.displayOrder));
    }
    return query.orderBy(asc(testimonials.displayOrder));
  }

  async findById(id: string) {
    const results = await db.select().from(testimonials).where(eq(testimonials.id, id)).limit(1);
    return results[0] || null;
  }

  async create(data: typeof testimonials.$inferInsert) {
    const results = await db.insert(testimonials).values(data).returning();
    return results[0];
  }

  async update(id: string, data: Partial<typeof testimonials.$inferInsert>) {
    const results = await db.update(testimonials).set(data).where(eq(testimonials.id, id)).returning();
    return results[0] || null;
  }

  async delete(id: string) {
    const results = await db.delete(testimonials).where(eq(testimonials.id, id)).returning();
    return results[0] || null;
  }

  async reorder(items: Array<{ id: string; displayOrder: number }>) {
    return db.transaction(async (tx) => {
      for (const item of items) {
        await tx.update(testimonials).set({ displayOrder: item.displayOrder }).where(eq(testimonials.id, item.id));
      }
      return true;
    });
  }

  async setVisibility(id: string, isVisible: boolean) {
    const results = await db.update(testimonials).set({ isVisible }).where(eq(testimonials.id, id)).returning();
    return results[0] || null;
  }
}

export const testimonialRepository = new TestimonialRepository();

