import { eq } from 'drizzle-orm';
import { db } from '../config/db.js';
import { siteSettings } from '../db/schema.js';

export class SettingsRepository {
  async getSettings() {
    const results = await db.select().from(siteSettings).limit(1);
    return results[0] || null;
  }

  async updateSettings(data: Partial<typeof siteSettings.$inferInsert>) {
    const current = await this.getSettings();

    if (!current) {
      // If no settings exist yet, create initial row
      const inserted = await db
        .insert(siteSettings)
        .values(data as typeof siteSettings.$inferInsert)
        .returning();
      return inserted[0];
    }

    const updated = await db
      .update(siteSettings)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(siteSettings.id, current.id))
      .returning();

    return updated[0];
  }
}

export const settingsRepository = new SettingsRepository();

