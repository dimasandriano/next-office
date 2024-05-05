import { pgEnum } from 'drizzle-orm/pg-core';

export const ERole = pgEnum('role', ['superadmin', 'admin', 'user']);
