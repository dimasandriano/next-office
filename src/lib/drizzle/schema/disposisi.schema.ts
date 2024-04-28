import { InferModel } from 'drizzle-orm';
import { pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const disposisi = pgTable('disposisi', {
  id: serial('id').primaryKey(),
  tgl_diterima: timestamp('tgl_diterima', { withTimezone: true }),
  isi: text('isi'),
  note_pengirim: varchar('note_pengirim', { length: 200 }),
  note_penerima: varchar('note_penerima', { length: 200 }),
  created_by: varchar('created_by', { length: 50 }),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export type TDisposisi = InferModel<typeof disposisi>;
