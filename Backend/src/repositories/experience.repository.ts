import { asc, eq } from 'drizzle-orm';
import { db } from '../config/db.js';
import { experiences } from '../db/schema.js';

export class ExperienceRepository {
  async findAll(includeHidden = true) {
    const query = db.select().from(experiences);
    if (!includeHidden) {
      return query.where(eq(experiences.isVisible, true)).orderBy(asc(experiences.displayOrder));
    }
    return query.orderBy(asc(experiences.displayOrder));
  }

  async findById(id: string) {
    const results = await db.select().from(experiences).where(eq(experiences.id, id)).limit(1);
    return results[0] || null;
  }

  async create(data: typeof experiences.$inferInsert) {
    const results = await db.insert(experiences).values(data).returning();
    return results[0];
  }

  async update(id: string, data: Partial<typeof experiences.$inferInsert>) {
    const results = await db.update(experiences).set(data).where(eq(experiences.id, id)).returning();
    return results[0] || null;
  }

  async delete(id: string) {
    const results = await db.delete(experiences).where(eq(experiences.id, id)).returning();
    return results[0] || null;
  }

  async reorder(items: Array<{ id: string; displayOrder: number }>) {
    return db.transaction(async (tx) => {
      for (const item of items) {
        await tx.update(experiences).set({ displayOrder: item.displayOrder }).where(eq(experiences.id, item.id));
      }
      return true;
    });
  }

  async setVisibility(id: string, isVisible: boolean) {
    const results = await db.update(experiences).set({ isVisible }).where(eq(experiences.id, id)).returning();
    return results[0] || null;
  }
}

export const experienceRepository = new ExperienceRepository();

