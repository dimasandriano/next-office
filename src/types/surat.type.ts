import { InferModel } from 'drizzle-orm';

import { surat } from '@/lib/drizzle/schema/surat.schema';

import { TSchemaDisposisi } from '@/types/disposisi.type';
import { TSchemaKategori } from '@/types/kategori.type';

export type TSchemaSurat = InferModel<typeof surat> & {
  kategori?: TSchemaKategori;
  disposisi?: TSchemaDisposisi;
};
