import { createInsertSchema } from 'drizzle-zod';
import { NextRequest, NextResponse } from 'next/server';
import { fromError } from 'zod-validation-error';

import { db } from '@/lib/drizzle/db';
import { divisi } from '@/lib/drizzle/schema/divisi.schema';
import { BadRequestError, UnauthorizedError } from '@/lib/exceptions';
import useVerifyJwt from '@/hooks/useVerifyJwt';

import { TSchemaDivisi } from '@/types/divisi.type';

const createSchema = createInsertSchema(divisi, {});
export async function POST(request: NextRequest) {
  const verify = useVerifyJwt(request);
  if (!verify) return UnauthorizedError();
  const body = await request.json();
  const result = createSchema.safeParse(body);
  if (!result.success)
    return BadRequestError(fromError(result.error).toString());
  const { nama, keterangan }: TSchemaDivisi = body;
  const data = await db.insert(divisi).values({ nama, keterangan }).returning();
  return NextResponse.json({ status: 'success', data });
}
