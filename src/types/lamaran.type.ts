import { InferModel } from 'drizzle-orm';

import { lamaran } from '@/lib/drizzle/schema/lamaran.schema';

import { TSchemaDisposisi } from '@/types/disposisi.type';

export type TSchemaLamaran = InferModel<typeof lamaran> & {
  disposisi?: TSchemaDisposisi;
};
