import db from '../../config/database.js';
import { cities } from '../../db/schema/index.js';
import { eq, ilike, asc, and, count } from 'drizzle-orm';

function mapCity(city) {
  return {
    id: city.id,
    name: city.name,
    descp: city.description,
  };
}

export const cityService = {
  async getAll({ page = 1, limit = 20, search } = {}) {
    const conditions = [];
    if (search) conditions.push(ilike(cities.name, `%${search}%`));

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const rows = await db
      .select()
      .from(cities)
      .where(whereClause)
      .orderBy(asc(cities.createdAt))
      .limit(limit)
      .offset((page - 1) * limit);
    return rows;
  },

  async getAllCount({ search } = {}) {
    const conditions = [];
    if (search) conditions.push(ilike(cities.name, `%${search}%`));

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [{ value }] = await db
      .select({ value: count() })
      .from(cities)
      .where(whereClause);
    return Number(value);
  },

  async getById(id) {
    const rows = await db
      .select()
      .from(cities)
      .where(eq(cities.id, id))
      .limit(1);
    return rows[0] || null;
  },

  async create(data) {
    const rows = await db
      .insert(cities)
      .values({
        name: data.name,
        description: data.descp,
      })
      .returning();
    return rows[0];
  },

  async update(id, data) {
    const updateData = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.descp !== undefined) updateData.description = data.descp;
    updateData.updatedAt = new Date();

    const rows = await db
      .update(cities)
      .set(updateData)
      .where(eq(cities.id, id))
      .returning();
    return rows[0] || null;
  },

  async delete(id) {
    const rows = await db
      .delete(cities)
      .where(eq(cities.id, id))
      .returning();
    return rows[0] || null;
  },

  async search(query) {
    const rows = await db
      .select()
      .from(cities)
      .where(ilike(cities.name, `%${query}%`))
      .orderBy(asc(cities.name));
    return rows;
  },

  formatResponse(row) {
    return mapCity(row);
  },
};
