import { asc, eq } from 'drizzle-orm';
import { db } from '../config/db.js';
import { socialLinks } from '../db/schema.js';

export class SocialRepository {
  async findAll(includeHidden = true) {
    const query = db.select().from(socialLinks);
    if (!includeHidden) {
      return query.where(eq(socialLinks.isVisible, true)).orderBy(asc(socialLinks.displayOrder));
    }
    return query.orderBy(asc(socialLinks.displayOrder));
  }

  async findById(id: string) {
    const results = await db.select().from(socialLinks).where(eq(socialLinks.id, id)).limit(1);
    return results[0] || null;
  }

  async create(data: typeof socialLinks.$inferInsert) {
    const results = await db.insert(socialLinks).values(data).returning();
    return results[0];
  }

  async update(id: string, data: Partial<typeof socialLinks.$inferInsert>) {
    const results = await db.update(socialLinks).set(data).where(eq(socialLinks.id, id)).returning();
    return results[0] || null;
  }

  async delete(id: string) {
    const results = await db.delete(socialLinks).where(eq(socialLinks.id, id)).returning();
    return results[0] || null;
  }

  async reorder(items: Array<{ id: string; displayOrder: number }>) {
    return db.transaction(async (tx) => {
      for (const item of items) {
        await tx.update(socialLinks).set({ displayOrder: item.displayOrder }).where(eq(socialLinks.id, item.id));
      }
      return true;
    });
  }

  async setVisibility(id: string, isVisible: boolean) {
    const results = await db.update(socialLinks).set({ isVisible }).where(eq(socialLinks.id, id)).returning();
    return results[0] || null;
  }
}

export const socialRepository = new SocialRepository();

