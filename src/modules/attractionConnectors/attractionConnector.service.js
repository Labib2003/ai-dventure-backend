import db from '../../config/database.js';
import { attractionConnectors, hotels, attractions } from '../../db/schema/index.js';
import { eq, ilike, asc, and, or, count } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';

const hotelAlias = alias(hotels, 'hotel');
const attractionAlias = alias(attractions, 'attraction');

function mapConnector(row) {
  return {
    id: row.id,
    hotelId: row.hotelId,
    hotel: row.hotel,
    attractionId: row.attractionId,
    attraction: row.attraction,
    mode: row.mode,
    time: row.time,
  };
}

function buildConditions({ search, mode }) {
  const conditions = [];
  if (search) {
    conditions.push(
      or(ilike(hotelAlias.name, `%${search}%`), ilike(attractionAlias.name, `%${search}%`)),
    );
  }
  if (mode) conditions.push(eq(attractionConnectors.mode, mode));
  return conditions.length > 0 ? and(...conditions) : undefined;
}

const selectCols = {
  id: attractionConnectors.id,
  hotelId: attractionConnectors.hotelId,
  hotel: hotelAlias.name,
  attractionId: attractionConnectors.attractionId,
  attraction: attractionAlias.name,
  mode: attractionConnectors.mode,
  time: attractionConnectors.time,
  createdAt: attractionConnectors.createdAt,
  updatedAt: attractionConnectors.updatedAt,
};

export const attractionConnectorService = {
  async getAll({ page = 1, limit = 20, search, mode } = {}) {
    const whereClause = buildConditions({ search, mode });

    const rows = await db
      .select(selectCols)
      .from(attractionConnectors)
      .leftJoin(hotelAlias, eq(attractionConnectors.hotelId, hotelAlias.id))
      .leftJoin(attractionAlias, eq(attractionConnectors.attractionId, attractionAlias.id))
      .where(whereClause)
      .orderBy(asc(attractionConnectors.createdAt))
      .limit(limit)
      .offset((page - 1) * limit);
    return rows;
  },

  async getAllCount({ search, mode } = {}) {
    const whereClause = buildConditions({ search, mode });

    const [{ value }] = await db
      .select({ value: count() })
      .from(attractionConnectors)
      .leftJoin(hotelAlias, eq(attractionConnectors.hotelId, hotelAlias.id))
      .leftJoin(attractionAlias, eq(attractionConnectors.attractionId, attractionAlias.id))
      .where(whereClause);
    return Number(value);
  },

  async getById(id) {
    const rows = await db
      .select(selectCols)
      .from(attractionConnectors)
      .leftJoin(hotelAlias, eq(attractionConnectors.hotelId, hotelAlias.id))
      .leftJoin(attractionAlias, eq(attractionConnectors.attractionId, attractionAlias.id))
      .where(eq(attractionConnectors.id, id))
      .limit(1);
    return rows[0] || null;
  },

  async create(data) {
    const rows = await db
      .insert(attractionConnectors)
      .values({
        hotelId: data.hotelId,
        attractionId: data.attractionId,
        mode: data.mode,
        time: data.time,
      })
      .returning();
    return await this.getById(rows[0].id);
  },

  async update(id, data) {
    const updateData = {};
    if (data.hotelId !== undefined) updateData.hotelId = data.hotelId;
    if (data.attractionId !== undefined) updateData.attractionId = data.attractionId;
    if (data.mode !== undefined) updateData.mode = data.mode;
    if (data.time !== undefined) updateData.time = data.time;
    updateData.updatedAt = new Date();

    const rows = await db
      .update(attractionConnectors)
      .set(updateData)
      .where(eq(attractionConnectors.id, id))
      .returning();
    if (!rows[0]) return null;
    return await this.getById(rows[0].id);
  },

  async delete(id) {
    const rows = await db
      .delete(attractionConnectors)
      .where(eq(attractionConnectors.id, id))
      .returning();
    return rows[0] || null;
  },

  formatResponse(row) {
    return mapConnector(row);
  },
};
