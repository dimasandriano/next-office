import { InferModel } from 'drizzle-orm';

import { disposisi } from '@/lib/drizzle/schema/disposisi.schema';

export type TSchemaDisposisi = InferModel<typeof disposisi>;
