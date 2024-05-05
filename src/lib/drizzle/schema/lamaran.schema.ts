import { pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

import { EStatus } from '@/enums/status.enum';

export const lamaran = pgTable('lamaran', {
  id: serial('id').primaryKey(),
  tgl: timestamp('tgl', { withTimezone: true }).notNull(),
  pelamar: varchar('pelamar', { length: 100 }).notNull(),
  ttl: varchar('ttl', { length: 50 }).notNull(),
  no_hp: varchar('no_hp', { length: 20 }).notNull(),
  pendidikan: text('pendidikan'),
  keterangan: varchar('keterangan', { length: 200 }),
  status: EStatus('status').notNull().default('PROCESS'),
  tgl_dikirim: timestamp('tgl_dikirim', { withTimezone: true }).notNull(),
  lampiran: varchar('lampiran', { length: 100 }),
  files: text('files'),
  created_by: varchar('created_by', { length: 50 }),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
