import { relations } from 'drizzle-orm';
import { pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

import { users } from '@/lib/drizzle/schema/users.schema';

export const divisi = pgTable('divisi', {
  id: serial('id').primaryKey(),
  nama: text('nama').notNull(),
  keterangan: text('keterangan'),
  created_by: varchar('created_by', { length: 50 }),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const divisiUsersRelations = relations(divisi, ({ many }) => ({
  users: many(users),
}));
