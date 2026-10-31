import { desc, eq, sql } from 'drizzle-orm';
import { db } from '../config/db.js';
import { messages } from '../db/schema.js';

export class MessageRepository {
  async findAll(page = 1, limit = 20, unreadOnly = false) {
    const offset = (page - 1) * limit;
    let query = db.select().from(messages);

    if (unreadOnly) {
      query = query.where(eq(messages.isRead, false)) as any;
    }

    const items = await query.orderBy(desc(messages.createdAt)).limit(limit).offset(offset);

    // Total count
    const countResult = await db
      .select({ count: sql<number>`cast(count(*) as integer)` })
      .from(messages)
      .where(unreadOnly ? eq(messages.isRead, false) : undefined);

    const total = countResult[0]?.count || 0;

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async countUnread() {
    const results = await db
      .select({ count: sql<number>`cast(count(*) as integer)` })
      .from(messages)
      .where(eq(messages.isRead, false));
    return results[0]?.count || 0;
  }

  async findById(id: string) {
    const results = await db.select().from(messages).where(eq(messages.id, id)).limit(1);
    return results[0] || null;
  }

  async create(data: typeof messages.$inferInsert) {
    const results = await db.insert(messages).values(data).returning();
    return results[0];
  }

  async markAsRead(id: string, isRead = true) {
    const results = await db.update(messages).set({ isRead }).where(eq(messages.id, id)).returning();
    return results[0] || null;
  }

  async delete(id: string) {
    const results = await db.delete(messages).where(eq(messages.id, id)).returning();
    return results[0] || null;
  }
}

export const messageRepository = new MessageRepository();

