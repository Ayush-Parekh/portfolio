import { asc, eq } from 'drizzle-orm';
import { db } from '../config/db.js';
import { education } from '../db/schema.js';

export class EducationRepository {
  async findAll(includeHidden = true) {
    const query = db.select().from(education);
    if (!includeHidden) {
      return query.where(eq(education.isVisible, true)).orderBy(asc(education.displayOrder));
    }
    return query.orderBy(asc(education.displayOrder));
  }

  async findById(id: string) {
    const results = await db.select().from(education).where(eq(education.id, id)).limit(1);
    return results[0] || null;
  }

  async create(data: typeof education.$inferInsert) {
    const results = await db.insert(education).values(data).returning();
    return results[0];
  }

  async update(id: string, data: Partial<typeof education.$inferInsert>) {
    const results = await db.update(education).set(data).where(eq(education.id, id)).returning();
    return results[0] || null;
  }

  async delete(id: string) {
    const results = await db.delete(education).where(eq(education.id, id)).returning();
    return results[0] || null;
  }

  async reorder(items: Array<{ id: string; displayOrder: number }>) {
    return db.transaction(async (tx) => {
      for (const item of items) {
        await tx.update(education).set({ displayOrder: item.displayOrder }).where(eq(education.id, item.id));
      }
      return true;
    });
  }

  async setVisibility(id: string, isVisible: boolean) {
    const results = await db.update(education).set({ isVisible }).where(eq(education.id, id)).returning();
    return results[0] || null;
  }
}

export const educationRepository = new EducationRepository();

