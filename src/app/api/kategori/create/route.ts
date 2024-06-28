import { createInsertSchema } from 'drizzle-zod';
import { NextRequest, NextResponse } from 'next/server';
import { fromError } from 'zod-validation-error';

import { db } from '@/lib/drizzle/db';
import { kategori } from '@/lib/drizzle/schema/kategori.schema';
import { BadRequestError, UnauthorizedError } from '@/lib/exceptions';
import useVerifyJwt from '@/hooks/useVerifyJwt';

import { TSchemaKategori } from '@/types/kategori.type';
const createSchema = createInsertSchema(kategori, {});
export async function POST(request: NextRequest) {
  const verify = useVerifyJwt(request);
  if (!verify) return UnauthorizedError();
  const body = await request.json();
  const result = createSchema.safeParse(body);
  if (!result.success)
    return BadRequestError(fromError(result.error).toString());
  const { nama, keterangan }: TSchemaKategori = body;
  const data = await db
    .insert(kategori)
    .values({ nama, keterangan })
    .returning();
  return NextResponse.json({ status: 'success', data });
}
