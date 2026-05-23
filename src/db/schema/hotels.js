import { pgTable, pgEnum, uuid, varchar, decimal, timestamp } from 'drizzle-orm/pg-core';
import { cities } from './cities.js';

export const hotelCategoryEnum = pgEnum('hotel_category', ['Budget', 'Standard', 'Premium', 'Luxury']);

export const hotels = pgTable('hotels', {
  id: uuid('id').defaultRandom().primaryKey(),
  cityId: uuid('city_id')
    .notNull()
    .references(() => cities.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  category: hotelCategoryEnum('category').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
