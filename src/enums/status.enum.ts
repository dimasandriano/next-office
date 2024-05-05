import { pgEnum } from 'drizzle-orm/pg-core';

export const EStatus = pgEnum('status', [
  'PROCESS',
  'ON REVIEW',
  'DONE',
  'ARRIVED',
  'ARCHIVED',
]);
