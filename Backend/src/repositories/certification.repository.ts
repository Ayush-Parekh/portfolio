import { asc, eq } from 'drizzle-orm';
import { db } from '../config/db.js';
import { certifications } from '../db/schema.js';

export class CertificationRepository {
  async findAll(includeHidden = true) {
    const query = db.select().from(certifications);
    if (!includeHidden) {
      return query.where(eq(certifications.isVisible, true)).orderBy(asc(certifications.displayOrder));
    }
    return query.orderBy(asc(certifications.displayOrder));
  }

  async findById(id: string) {
    const results = await db.select().from(certifications).where(eq(certifications.id, id)).limit(1);
    return results[0] || null;
  }

  async create(data: typeof certifications.$inferInsert) {
    const results = await db.insert(certifications).values(data).returning();
    return results[0];
  }

  async update(id: string, data: Partial<typeof certifications.$inferInsert>) {
    const results = await db.update(certifications).set(data).where(eq(certifications.id, id)).returning();
    return results[0] || null;
  }

  async delete(id: string) {
    const results = await db.delete(certifications).where(eq(certifications.id, id)).returning();
    return results[0] || null;
  }

  async reorder(items: Array<{ id: string; displayOrder: number }>) {
    return db.transaction(async (tx) => {
      for (const item of items) {
        await tx.update(certifications).set({ displayOrder: item.displayOrder }).where(eq(certifications.id, item.id));
      }
      return true;
    });
  }

  async setVisibility(id: string, isVisible: boolean) {
    const results = await db.update(certifications).set({ isVisible }).where(eq(certifications.id, id)).returning();
    return results[0] || null;
  }
}

export const certificationRepository = new CertificationRepository();

