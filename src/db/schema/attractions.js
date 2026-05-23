import { pgTable, pgEnum, uuid, varchar, text, decimal, timestamp } from 'drizzle-orm/pg-core';
import { cities } from './cities.js';

export const attractionCategoryEnum = pgEnum('attraction_category', [
  'Nature',
  'Beach',
  'Historic',
  'Adventure',
  'Culture',
]);

export const attractions = pgTable('attractions', {
  id: uuid('id').defaultRandom().primaryKey(),
  cityId: uuid('city_id')
    .notNull()
    .references(() => cities.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description').notNull(),
  lat: decimal('lat', { precision: 10, scale: 7 }).notNull(),
  long: decimal('long', { precision: 10, scale: 7 }).notNull(),
  category: attractionCategoryEnum('category').notNull(),
  rating: decimal('rating', { precision: 3, scale: 2 }).notNull(),
  openingHours: varchar('opening_hours', { length: 100 }).notNull(),
  entryFee: decimal('entry_fee', { precision: 10, scale: 2 }).notNull(),
  duration: varchar('duration', { length: 100 }).notNull(),
  imageUrl: text('image_url').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
