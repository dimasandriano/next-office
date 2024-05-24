import { InferModel } from 'drizzle-orm';

import { users } from '@/lib/drizzle/schema/users.schema';

import { TSchemaDivisi } from '@/types/divisi.type';

export type TSchemaUsers = InferModel<typeof users> & {
  division: TSchemaDivisi;
};
