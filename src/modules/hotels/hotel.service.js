import db from '../../config/database.js';
import { hotels, cities } from '../../db/schema/index.js';
import { eq, ilike, asc, and, count } from 'drizzle-orm';

function mapHotel(row) {
  return {
    id: row.id,
    cityId: row.cityId,
    city: row.city,
    name: row.name,
    category: row.category,
    price: row.price,
  };
}

function buildConditions({ search, category }) {
  const conditions = [];
  if (search) conditions.push(ilike(hotels.name, `%${search}%`));
  if (category) conditions.push(eq(hotels.category, category));
  return conditions.length > 0 ? and(...conditions) : undefined;
}

const selectCols = {
  id: hotels.id,
  cityId: hotels.cityId,
  city: cities.name,
  name: hotels.name,
  category: hotels.category,
  price: hotels.price,
  createdAt: hotels.createdAt,
  updatedAt: hotels.updatedAt,
};

export const hotelService = {
  async getAll({ page = 1, limit = 20, search, category } = {}) {
    const whereClause = buildConditions({ search, category });

    const rows = await db
      .select(selectCols)
      .from(hotels)
      .leftJoin(cities, eq(hotels.cityId, cities.id))
      .where(whereClause)
      .orderBy(asc(hotels.createdAt))
      .limit(limit)
      .offset((page - 1) * limit);
    return rows;
  },

  async getAllCount({ search, category } = {}) {
    const whereClause = buildConditions({ search, category });

    const [{ value }] = await db
      .select({ value: count() })
      .from(hotels)
      .leftJoin(cities, eq(hotels.cityId, cities.id))
      .where(whereClause);
    return Number(value);
  },

  async getById(id) {
    const rows = await db
      .select(selectCols)
      .from(hotels)
      .leftJoin(cities, eq(hotels.cityId, cities.id))
      .where(eq(hotels.id, id))
      .limit(1);
    return rows[0] || null;
  },

  async create(data) {
    const rows = await db
      .insert(hotels)
      .values({
        cityId: data.cityId,
        name: data.name,
        category: data.category,
        price: data.price,
      })
      .returning();
    return await this.getById(rows[0].id);
  },

  async update(id, data) {
    const updateData = {};
    if (data.cityId !== undefined) updateData.cityId = data.cityId;
    if (data.name !== undefined) updateData.name = data.name;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.price !== undefined) updateData.price = data.price;
    updateData.updatedAt = new Date();

    const rows = await db
      .update(hotels)
      .set(updateData)
      .where(eq(hotels.id, id))
      .returning();
    if (!rows[0]) return null;
    return await this.getById(rows[0].id);
  },

  async delete(id) {
    const rows = await db
      .delete(hotels)
      .where(eq(hotels.id, id))
      .returning();
    return rows[0] || null;
  },

  formatResponse(row) {
    return mapHotel(row);
  },
};
