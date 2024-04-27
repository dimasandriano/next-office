import { InferModel } from 'drizzle-orm';
import { pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const kategori = pgTable('kategori', {
  id: serial('id').primaryKey(),
  nama: text('nama').notNull(),
  keterangan: text('keterangan'),
  created_by: varchar('created_by', { length: 50 }),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export type TKategori = InferModel<typeof kategori>;
