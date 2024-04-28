import { createInsertSchema } from 'drizzle-zod';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { db } from '@/lib/drizzle/db';
import { disposisi, TDisposisi } from '@/lib/drizzle/schema/disposisi.schema';
import useVerifyJwt from '@/hooks/useVerifyJwt';

const createSchema = createInsertSchema(disposisi, {
  tgl_diterima: z.string().refine((val) => new Date(val) instanceof Date),
});

export async function POST(request: NextRequest) {
  const verify = useVerifyJwt(request);
  if (!verify) {
    return NextResponse.json(
      { status: 'error', error: 'Unauthorized' },
      {
        status: 401,
      },
    );
  }
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
  const { isi, note_pengirim, note_penerima, tgl_diterima }: TDisposisi = body;
  const data = await db
    .insert(disposisi)
    .values({
      isi,
      note_pengirim,
      note_penerima,
      tgl_diterima: tgl_diterima && new Date(tgl_diterima),
    })
    .returning();
  return NextResponse.json({ status: 'success', data });
}
