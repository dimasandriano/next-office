import { InferModel } from 'drizzle-orm';

import { divisi } from '@/lib/drizzle/schema/divisi.schema';

export type TSchemaDivisi = InferModel<typeof divisi>;
