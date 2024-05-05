import { InferModel } from 'drizzle-orm';

import { users } from '@/lib/drizzle/schema/users.schema';

export type TSchemaUsers = InferModel<typeof users>;
