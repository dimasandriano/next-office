import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

import { divisi } from '@/lib/drizzle/schema/divisi.schema';

import { ERole } from '@/enums/role.enum';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  full_name: text('full_name').notNull(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  password: text('password').notNull(),
  role: ERole('role').notNull().default('user'),
  is_active: boolean('is_active').notNull().default(false),
  divisi_id: integer('divisi_id'),
  created_by: varchar('created_by', { length: 50 }),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const usersDivisiRelations = relations(users, ({ one }) => ({
  division: one(divisi, {
    fields: [users.divisi_id],
    references: [divisi.id],
  }),
}));
