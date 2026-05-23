import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { config } from 'dotenv';

config();

const connectionString = process.env.DATABASE_URL;

const client = postgres(connectionString, {
  prepare: false,
  ssl: 'require',
});
const db = drizzle(client);

export default db;
