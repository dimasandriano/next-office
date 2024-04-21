import { InferModel } from 'drizzle-orm';
import {
  boolean,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
export const roleEnum = pgEnum('role', ['superadmin', 'admin', 'user']);
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  full_name: text('full_name').notNull(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  password: text('password').notNull(),
  role: roleEnum('role').notNull().default('user'),
  is_active: boolean('is_active').notNull().default(false),
  created_by: varchar('created_by', { length: 50 }),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export type TUsers = InferModel<typeof users>;
