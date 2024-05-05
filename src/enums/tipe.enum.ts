import { pgEnum } from 'drizzle-orm/pg-core';

export const ETipe = pgEnum('tipe', [
  'surat_masuk',
  'surat_keluar',
  'surat_external',
  'lamaran',
]);
