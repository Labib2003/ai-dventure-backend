import db from '../../config/database.js';
import { travelConnectors, cities } from '../../db/schema/index.js';
import { eq, ilike, asc, and, or, count } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';

const city1 = alias(cities, 'city1');
const city2 = alias(cities, 'city2');

function mapConnector(row) {
  return {
    id: row.id,
    city1Id: row.city1Id,
    city1: row.city1,
    city2Id: row.city2Id,
    city2: row.city2,
    mode: row.mode,
    timeInMinutes: row.timeInMinutes,
  };
}

function buildConditions({ search, mode }) {
  const conditions = [];
  if (search) {
    conditions.push(
      or(ilike(city1.name, `%${search}%`), ilike(city2.name, `%${search}%`)),
    );
  }
  if (mode) conditions.push(eq(travelConnectors.mode, mode));
  return conditions.length > 0 ? and(...conditions) : undefined;
}

const selectCols = {
  id: travelConnectors.id,
  city1Id: travelConnectors.city1Id,
  city1: city1.name,
  city2Id: travelConnectors.city2Id,
  city2: city2.name,
  mode: travelConnectors.mode,
  timeInMinutes: travelConnectors.timeInMinutes,
  createdAt: travelConnectors.createdAt,
  updatedAt: travelConnectors.updatedAt,
};

export const travelConnectorService = {
  async getAll({ page = 1, limit = 20, search, mode } = {}) {
    const whereClause = buildConditions({ search, mode });

    const rows = await db
      .select(selectCols)
      .from(travelConnectors)
      .leftJoin(city1, eq(travelConnectors.city1Id, city1.id))
      .leftJoin(city2, eq(travelConnectors.city2Id, city2.id))
      .where(whereClause)
      .orderBy(asc(travelConnectors.createdAt))
      .limit(limit)
      .offset((page - 1) * limit);
    return rows;
  },

  async getAllCount({ search, mode } = {}) {
    const whereClause = buildConditions({ search, mode });

    const [{ value }] = await db
      .select({ value: count() })
      .from(travelConnectors)
      .leftJoin(city1, eq(travelConnectors.city1Id, city1.id))
      .leftJoin(city2, eq(travelConnectors.city2Id, city2.id))
      .where(whereClause);
    return Number(value);
  },

  async getById(id) {
    const rows = await db
      .select(selectCols)
      .from(travelConnectors)
      .leftJoin(city1, eq(travelConnectors.city1Id, city1.id))
      .leftJoin(city2, eq(travelConnectors.city2Id, city2.id))
      .where(eq(travelConnectors.id, id))
      .limit(1);
    return rows[0] || null;
  },

  async create(data) {
    const rows = await db
      .insert(travelConnectors)
      .values({
        city1Id: data.city1Id,
        city2Id: data.city2Id,
        mode: data.mode,
        timeInMinutes: data.timeInMinutes,
      })
      .returning();
    return await this.getById(rows[0].id);
  },

  async update(id, data) {
    const updateData = {};
    if (data.city1Id !== undefined) updateData.city1Id = data.city1Id;
    if (data.city2Id !== undefined) updateData.city2Id = data.city2Id;
    if (data.mode !== undefined) updateData.mode = data.mode;
    if (data.timeInMinutes !== undefined) updateData.timeInMinutes = data.timeInMinutes;
    updateData.updatedAt = new Date();

    const rows = await db
      .update(travelConnectors)
      .set(updateData)
      .where(eq(travelConnectors.id, id))
      .returning();
    if (!rows[0]) return null;
    return await this.getById(rows[0].id);
  },

  async delete(id) {
    const rows = await db
      .delete(travelConnectors)
      .where(eq(travelConnectors.id, id))
      .returning();
    return rows[0] || null;
  },

  formatResponse(row) {
    return mapConnector(row);
  },
};
