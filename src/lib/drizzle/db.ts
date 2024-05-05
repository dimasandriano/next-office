import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as disposisi from './schema/disposisi.schema';
import * as divisi from './schema/divisi.schema';
import * as kategori from './schema/kategori.schema';
import * as lamaran from './schema/lamaran.schema';
import * as surat from './schema/surat.schema';
import * as users from './schema/users.schema';

const connectionString = process.env.DATABASE_URL;

const client = postgres(connectionString as string, { prepare: false });
export const db = drizzle(client, {
  schema: {
    ...users,
    ...divisi,
    ...kategori,
    ...surat,
    ...disposisi,
    ...lamaran,
  },
});
