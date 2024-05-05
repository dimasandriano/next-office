import { InferModel } from 'drizzle-orm';

import { lamaran } from '@/lib/drizzle/schema/lamaran.schema';

export type TSchemaLamaran = InferModel<typeof lamaran>;
