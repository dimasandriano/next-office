import { InferModel } from 'drizzle-orm';
import { pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

import { statusEnum } from '@/lib/drizzle/schema/surat.schema';

export const lamaran = pgTable('lamaran', {
  id: serial('id').primaryKey(),
  tgl: timestamp('tgl', { withTimezone: true }).notNull(),
  pelamar: varchar('pelamar', { length: 100 }).notNull(),
  ttl: varchar('ttl', { length: 50 }).notNull(),
  no_hp: varchar('no_hp', { length: 20 }).notNull(),
  pendidikan: text('pendidikan'),
  keterangan: varchar('keterangan', { length: 200 }),
  status: statusEnum('status').notNull().default('PROCESS'),
  tgl_dikirim: timestamp('tgl_dikirim', { withTimezone: true }).notNull(),
  lampiran: varchar('lampiran', { length: 100 }),
  files: text('files'),
  created_by: varchar('created_by', { length: 50 }),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export type TLamaran = InferModel<typeof lamaran>;
