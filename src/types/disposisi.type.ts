import { InferModel } from 'drizzle-orm';

import { disposisi } from '@/lib/drizzle/schema/disposisi.schema';

import { TSchemaDivisi } from '@/types/divisi.type';
import { TSchemaLamaran } from '@/types/lamaran.type';
import { TSchemaSurat } from '@/types/surat.type';

export type TSchemaDisposisi = InferModel<typeof disposisi> & {
  divisi?: TSchemaDivisi;
  surat?: TSchemaSurat;
  lamaran?: TSchemaLamaran;
};
