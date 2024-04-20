import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as users from './schema/users.schema';
const connectionString = process.env.DATABASE_URL;

const client = postgres(connectionString as string, { prepare: false });
export const db = drizzle(client, { schema: { ...users } });
