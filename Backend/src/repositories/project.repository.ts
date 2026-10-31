import { asc, desc, eq } from 'drizzle-orm';
import { db } from '../config/db.js';
import { projects } from '../db/schema.js';

export class ProjectRepository {
  async findAll(includeHidden = true) {
    const query = db.select().from(projects);
    if (!includeHidden) {
      return query.where(eq(projects.isVisible, true)).orderBy(asc(projects.displayOrder));
    }
    return query.orderBy(asc(projects.displayOrder));
  }

  async findById(id: string) {
    const results = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
    return results[0] || null;
  }

  async findBySlug(slug: string) {
    const results = await db.select().from(projects).where(eq(projects.slug, slug)).limit(1);
    return results[0] || null;
  }

  async create(data: typeof projects.$inferInsert) {
    const results = await db.insert(projects).values(data).returning();
    return results[0];
  }

  async update(id: string, data: Partial<typeof projects.$inferInsert>) {
    const results = await db
      .update(projects)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return results[0] || null;
  }

  async delete(id: string) {
    const results = await db.delete(projects).where(eq(projects.id, id)).returning();
    return results[0] || null;
  }

  async reorder(items: Array<{ id: string; displayOrder: number }>) {
    return db.transaction(async (tx) => {
      for (const item of items) {
        await tx
          .update(projects)
          .set({ displayOrder: item.displayOrder, updatedAt: new Date() })
          .where(eq(projects.id, item.id));
      }
      return true;
    });
  }

  async setVisibility(id: string, isVisible: boolean) {
    const results = await db
      .update(projects)
      .set({ isVisible, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return results[0] || null;
  }
}

export const projectRepository = new ProjectRepository();

