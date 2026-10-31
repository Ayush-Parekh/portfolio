import { eq } from 'drizzle-orm';
import { db } from '../config/db.js';
import { adminUsers } from '../db/schema.js';

export class AdminRepository {
  async findByEmail(email: string) {
    const results = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, email))
      .limit(1);
    return results[0] || null;
  }

  async findById(id: string) {
    const results = await db
      .select({
        id: adminUsers.id,
        email: adminUsers.email,
        fullName: adminUsers.fullName,
        createdAt: adminUsers.createdAt,
        updatedAt: adminUsers.updatedAt,
      })
      .from(adminUsers)
      .where(eq(adminUsers.id, id))
      .limit(1);
    return results[0] || null;
  }
}

export const adminRepository = new AdminRepository();

