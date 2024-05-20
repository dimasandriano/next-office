import { relations } from 'drizzle-orm';
import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

import { disposisi } from '@/lib/drizzle/schema/disposisi.schema';
import { kategori } from '@/lib/drizzle/schema/kategori.schema';

import { ESifat } from '@/enums/sifat.enum';
import { EStatus } from '@/enums/status.enum';
import { ETipe } from '@/enums/tipe.enum';

export const surat = pgTable('surat', {
  id: serial('id').primaryKey(),
  tipe: ETipe('tipe').notNull().default('surat_masuk'),
  no_surat: varchar('no_surat', { length: 50 }).notNull(),
  tgl_masuk: timestamp('tgl_masuk').notNull().defaultNow(),
  sifat: ESifat('sifat'),
  pengirim: varchar('pengirim', { length: 50 }),
  peminta: varchar('peminta', { length: 50 }),
  kategori_id: integer('kategori_id'),
  perihal: varchar('perihal', { length: 50 }),
  ditujukan: varchar('ditujukan', { length: 255 }),
  tgl_kegiatan: timestamp('tgl_kegiatan').notNull(),
  nama_kegiatan: varchar('nama_kegiatan', { length: 100 }),
  tempat: varchar('tempat', { length: 100 }),
  jam: varchar('jam', { length: 20 }),
  keterangan: varchar('keterangan', { length: 200 }),
  status: EStatus('status').notNull().default('PROCESS'),
  tgl_dikirim: timestamp('tgl_dikirim').notNull(),
  lampiran: varchar('lampiran', { length: 100 }),
  tgl_diterima: timestamp('tgl_diterima'),
  penerima: varchar('penerima', { length: 50 }),
  isi: varchar('isi', { length: 200 }),
  files: text('files'),
  created_by: varchar('created_by', { length: 50 }),
  created_at: timestamp('created_at').defaultNow(),
});
export const suratKategoriRelations = relations(surat, ({ one }) => ({
  kategori: one(kategori, {
    fields: [surat.kategori_id],
    references: [kategori.id],
  }),
}));

export const suratDisposisiRelations = relations(surat, ({ one }) => ({
  disposisi: one(disposisi, {
    fields: [surat.id],
    references: [disposisi.surat_id],
  }),
}));
