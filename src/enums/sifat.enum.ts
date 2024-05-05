import { pgEnum } from 'drizzle-orm/pg-core';

export const ESifat = pgEnum('sifat', [
  'penting',
  'rahasia',
  'biasa',
  'segera',
]);
