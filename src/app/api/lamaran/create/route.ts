import { createInsertSchema } from 'drizzle-zod';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { db } from '@/lib/drizzle/db';
import { lamaran } from '@/lib/drizzle/schema/lamaran.schema';
import { UnauthorizedError } from '@/lib/exceptions';
import useVerifyJwt from '@/hooks/useVerifyJwt';

import { TSchemaLamaran } from '@/types/lamaran.type';

const createSchema = createInsertSchema(lamaran, {
  tgl: z.string().refine((val) => new Date(val) instanceof Date),
  tgl_dikirim: z.string().refine((val) => new Date(val) instanceof Date),
});

export async function POST(request: NextRequest) {
  const verify = useVerifyJwt(request);
  if (!verify) return UnauthorizedError();
  const body = await request.json();
  const result = createSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      {
        status: 'error',
        error: result.error.issues,
      },
      { status: 400 },
    );
  }
  const {
    tgl,
    pelamar,
    ttl,
    no_hp,
    pendidikan,
    keterangan,
    status,
    tgl_dikirim,
    lampiran,
    files,
    created_by,
  }: TSchemaLamaran = body;
  const data = await db
    .insert(lamaran)
    .values({
      tgl: tgl && new Date(tgl),
      pelamar,
      ttl,
      no_hp,
      pendidikan,
      keterangan,
      status,
      tgl_dikirim: tgl_dikirim && new Date(tgl_dikirim),
      lampiran,
      files,
      created_by,
    })
    .returning();
  return NextResponse.json({ status: 'success', data });
}
