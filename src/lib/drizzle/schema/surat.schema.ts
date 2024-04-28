import { InferModel } from 'drizzle-orm';
import {
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const tipeEnum = pgEnum('tipe', [
  'surat_masuk',
  'surat_keluar',
  'surat_external',
  'lamaran',
]);

export const sifatEnum = pgEnum('sifat', [
  'penting',
  'rahasia',
  'biasa',
  'segera',
]);

export const statusEnum = pgEnum('status', [
  'PROCESS',
  'ON REVIEW',
  'DONE',
  'ARRIVED',
  'ARCHIVED',
]);

export const surat = pgTable('surat', {
  id: serial('id').primaryKey(),
  tipe: tipeEnum('tipe').notNull().default('surat_masuk'),
  no_surat: varchar('no_surat', { length: 50 }).notNull(),
  tgl_masuk: timestamp('tgl_masuk').notNull().defaultNow(),
  sifat: sifatEnum('sifat'),
  pengirim: varchar('pengirim', { length: 50 }),
  peminta: varchar('peminta', { length: 50 }),
  perihal: varchar('perihal', { length: 50 }),
  tgl_kegiatan: timestamp('tgl_kegiatan').notNull(),
  nama_kegiatan: varchar('nama_kegiatan', { length: 100 }),
  tempat: varchar('tempat', { length: 100 }),
  jam: varchar('jam', { length: 20 }),
  keterangan: varchar('keterangan', { length: 200 }),
  status: statusEnum('status').notNull().default('PROCESS'),
  tgl_dikirim: timestamp('tgl_dikirim').notNull(),
  lampiran: varchar('lampiran', { length: 100 }),
  tgl_diterima: timestamp('tgl_diterima'),
  penerima: varchar('penerima', { length: 50 }),
  isi: varchar('isi', { length: 200 }),
  files: text('files'),
  created_by: varchar('created_by', { length: 50 }),
  created_at: timestamp('created_at').defaultNow(),
});

export type TSurat = InferModel<typeof surat>;
