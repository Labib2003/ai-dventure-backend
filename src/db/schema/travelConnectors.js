import { pgTable, pgEnum, uuid, integer, timestamp } from 'drizzle-orm/pg-core';
import { cities } from './cities.js';

export const travelModeEnum = pgEnum('travel_mode', ['Car', 'Bus', 'Bike', 'Walk', 'Boat']);

export const travelConnectors = pgTable('travel_connectors', {
  id: uuid('id').defaultRandom().primaryKey(),
  city1Id: uuid('city1_id')
    .notNull()
    .references(() => cities.id, { onDelete: 'cascade' }),
  city2Id: uuid('city2_id')
    .notNull()
    .references(() => cities.id, { onDelete: 'cascade' }),
  mode: travelModeEnum('mode').notNull(),
  timeInMinutes: integer('time_in_minutes').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
