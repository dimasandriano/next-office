import { InferModel } from 'drizzle-orm';

import { surat } from '@/lib/drizzle/schema/surat.schema';

export type TSchemaSurat = InferModel<typeof surat>;
