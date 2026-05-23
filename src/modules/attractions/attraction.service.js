import db from '../../config/database.js';
import { attractions, cities } from '../../db/schema/index.js';
import { eq, ilike, asc, and, count } from 'drizzle-orm';

function mapAttraction(row) {
  return {
    id: row.id,
    cityId: row.cityId,
    city: row.city,
    name: row.name,
    descp: row.description,
    lat: Number(row.lat),
    long: Number(row.long),
    category: row.category,
    rating: Number(row.rating),
    openingHours: row.openingHours,
    entryFee: Number(row.entryFee),
    duration: row.duration,
    imageUrl: row.imageUrl,
  };
}

function buildConditions({ search, category }) {
  const conditions = [];
  if (search) conditions.push(ilike(attractions.name, `%${search}%`));
  if (category) conditions.push(eq(attractions.category, category));
  return conditions.length > 0 ? and(...conditions) : undefined;
}

const selectCols = {
  id: attractions.id,
  cityId: attractions.cityId,
  city: cities.name,
  name: attractions.name,
  description: attractions.description,
  lat: attractions.lat,
  long: attractions.long,
  category: attractions.category,
  rating: attractions.rating,
  openingHours: attractions.openingHours,
  entryFee: attractions.entryFee,
  duration: attractions.duration,
  imageUrl: attractions.imageUrl,
  createdAt: attractions.createdAt,
  updatedAt: attractions.updatedAt,
};

export const attractionService = {
  async getAll({ page = 1, limit = 20, search, category } = {}) {
    const whereClause = buildConditions({ search, category });

    const rows = await db
      .select(selectCols)
      .from(attractions)
      .leftJoin(cities, eq(attractions.cityId, cities.id))
      .where(whereClause)
      .orderBy(asc(attractions.createdAt))
      .limit(limit)
      .offset((page - 1) * limit);
    return rows;
  },

  async getAllCount({ search, category } = {}) {
    const whereClause = buildConditions({ search, category });

    const [{ value }] = await db
      .select({ value: count() })
      .from(attractions)
      .leftJoin(cities, eq(attractions.cityId, cities.id))
      .where(whereClause);
    return Number(value);
  },

  async getById(id) {
    const rows = await db
      .select(selectCols)
      .from(attractions)
      .leftJoin(cities, eq(attractions.cityId, cities.id))
      .where(eq(attractions.id, id))
      .limit(1);
    return rows[0] || null;
  },

  async create(data) {
    const rows = await db
      .insert(attractions)
      .values({
        cityId: data.cityId,
        name: data.name,
        description: data.descp,
        lat: data.lat,
        long: data.long,
        category: data.category,
        rating: data.rating,
        openingHours: data.openingHours,
        entryFee: data.entryFee,
        duration: data.duration,
        imageUrl: data.imageUrl,
      })
      .returning();
    return await this.getById(rows[0].id);
  },

  async update(id, data) {
    const updateData = {};
    if (data.cityId !== undefined) updateData.cityId = data.cityId;
    if (data.name !== undefined) updateData.name = data.name;
    if (data.descp !== undefined) updateData.description = data.descp;
    if (data.lat !== undefined) updateData.lat = data.lat;
    if (data.long !== undefined) updateData.long = data.long;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.rating !== undefined) updateData.rating = data.rating;
    if (data.openingHours !== undefined) updateData.openingHours = data.openingHours;
    if (data.entryFee !== undefined) updateData.entryFee = data.entryFee;
    if (data.duration !== undefined) updateData.duration = data.duration;
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
    updateData.updatedAt = new Date();

    const rows = await db
      .update(attractions)
      .set(updateData)
      .where(eq(attractions.id, id))
      .returning();
    if (!rows[0]) return null;
    return await this.getById(rows[0].id);
  },

  async delete(id) {
    const rows = await db
      .delete(attractions)
      .where(eq(attractions.id, id))
      .returning();
    return rows[0] || null;
  },

  formatResponse(row) {
    return mapAttraction(row);
  },
};
