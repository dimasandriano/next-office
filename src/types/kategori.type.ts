import { InferModel } from 'drizzle-orm';

import { kategori } from '@/lib/drizzle/schema/kategori.schema';

export type TSchemaKategori = InferModel<typeof kategori>;
