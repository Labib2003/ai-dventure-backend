import { pgTable, uuid, integer, timestamp } from 'drizzle-orm/pg-core';
import { travelModeEnum } from './travelConnectors.js';
import { hotels } from './hotels.js';
import { attractions } from './attractions.js';

export const attractionConnectors = pgTable('attraction_connectors', {
  id: uuid('id').defaultRandom().primaryKey(),
  hotelId: uuid('hotel_id')
    .notNull()
    .references(() => hotels.id, { onDelete: 'cascade' }),
  attractionId: uuid('attraction_id')
    .notNull()
    .references(() => attractions.id, { onDelete: 'cascade' }),
  mode: travelModeEnum('mode').notNull(),
  time: integer('time').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
