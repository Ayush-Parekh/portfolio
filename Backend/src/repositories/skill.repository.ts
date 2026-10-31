import { asc, eq } from 'drizzle-orm';
import { db } from '../config/db.js';
import { skillCategories, skills } from '../db/schema.js';

export class SkillRepository {
  // Categories
  async findAllCategories(includeHidden = true) {
    const query = db.select().from(skillCategories);
    if (!includeHidden) {
      return query.where(eq(skillCategories.isVisible, true)).orderBy(asc(skillCategories.displayOrder));
    }
    return query.orderBy(asc(skillCategories.displayOrder));
  }

  async findCategoryById(id: string) {
    const results = await db.select().from(skillCategories).where(eq(skillCategories.id, id)).limit(1);
    return results[0] || null;
  }

  async createCategory(data: typeof skillCategories.$inferInsert) {
    const results = await db.insert(skillCategories).values(data).returning();
    return results[0];
  }

  async updateCategory(id: string, data: Partial<typeof skillCategories.$inferInsert>) {
    const results = await db.update(skillCategories).set(data).where(eq(skillCategories.id, id)).returning();
    return results[0] || null;
  }

  async deleteCategory(id: string) {
    const results = await db.delete(skillCategories).where(eq(skillCategories.id, id)).returning();
    return results[0] || null;
  }

  async reorderCategories(items: Array<{ id: string; displayOrder: number }>) {
    return db.transaction(async (tx) => {
      for (const item of items) {
        await tx.update(skillCategories).set({ displayOrder: item.displayOrder }).where(eq(skillCategories.id, item.id));
      }
      return true;
    });
  }

  // Skills
  async findAllSkills(categoryId?: string, includeHidden = true) {
    const query = db.select().from(skills);
    if (categoryId && !includeHidden) {
      return query
        .where(eq(skills.categoryId, categoryId))
        .orderBy(asc(skills.displayOrder));
    }
    if (categoryId) {
      return query.where(eq(skills.categoryId, categoryId)).orderBy(asc(skills.displayOrder));
    }
    if (!includeHidden) {
      return query.where(eq(skills.isVisible, true)).orderBy(asc(skills.displayOrder));
    }
    return query.orderBy(asc(skills.displayOrder));
  }

  async findSkillById(id: string) {
    const results = await db.select().from(skills).where(eq(skills.id, id)).limit(1);
    return results[0] || null;
  }

  async createSkill(data: typeof skills.$inferInsert) {
    const results = await db.insert(skills).values(data).returning();
    return results[0];
  }

  async updateSkill(id: string, data: Partial<typeof skills.$inferInsert>) {
    const results = await db.update(skills).set(data).where(eq(skills.id, id)).returning();
    return results[0] || null;
  }

  async deleteSkill(id: string) {
    const results = await db.delete(skills).where(eq(skills.id, id)).returning();
    return results[0] || null;
  }

  async reorderSkills(items: Array<{ id: string; displayOrder: number }>) {
    return db.transaction(async (tx) => {
      for (const item of items) {
        await tx.update(skills).set({ displayOrder: item.displayOrder }).where(eq(skills.id, item.id));
      }
      return true;
    });
  }

  async setSkillVisibility(id: string, isVisible: boolean) {
    const results = await db.update(skills).set({ isVisible }).where(eq(skills.id, id)).returning();
    return results[0] || null;
  }

  /**
   * Returns categories with their corresponding skills nested
   */
  async getCategorizedSkills(includeHidden = true) {
    const categories = await this.findAllCategories(includeHidden);
    const allSkills = await this.findAllSkills(undefined, includeHidden);

    return categories.map((cat) => ({
      ...cat,
      skills: allSkills.filter((s) => s.categoryId === cat.id),
    }));
  }
}

export const skillRepository = new SkillRepository();

