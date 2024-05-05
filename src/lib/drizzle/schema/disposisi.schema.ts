import { relations } from 'drizzle-orm';
import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

import { divisi } from '@/lib/drizzle/schema/divisi.schema';

export const disposisi = pgTable('disposisi', {
  id: serial('id').primaryKey(),
  tgl_diterima: timestamp('tgl_diterima', { withTimezone: true }),
  isi: text('isi'),
  note_pengirim: varchar('note_pengirim', { length: 200 }),
  note_penerima: varchar('note_penerima', { length: 200 }),
  divisi_id: integer('divisi_id'),
  surat_id: integer('surat_id'),
  lamaran_id: integer('lamaran_id'),
  created_by: varchar('created_by', { length: 50 }),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const disposisiDivisiRelations = relations(disposisi, ({ one }) => ({
  divisi: one(divisi, {
    fields: [disposisi.divisi_id],
    references: [divisi.id],
  }),
}));
export const disposisiSuratRelations = relations(disposisi, ({ one }) => ({
  surat: one(divisi, {
    fields: [disposisi.surat_id],
    references: [divisi.id],
  }),
}));
export const disposisiLamaranRelations = relations(disposisi, ({ one }) => ({
  lamaran: one(divisi, {
    fields: [disposisi.lamaran_id],
    references: [divisi.id],
  }),
}));
