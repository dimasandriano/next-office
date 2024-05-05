import { eq } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { db } from '@/lib/drizzle/db';
import { lamaran } from '@/lib/drizzle/schema/lamaran.schema';
import useVerifyJwt from '@/hooks/useVerifyJwt';

import { TSchemaLamaran } from '@/types/lamaran.type';

const editSchema = createInsertSchema(lamaran, {
  tgl: z.string().refine((val) => new Date(val) instanceof Date),
  tgl_dikirim: z.string().refine((val) => new Date(val) instanceof Date),
});
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  const verify = useVerifyJwt(request);
  if (!verify) {
    return NextResponse.json(
      { status: 'error', error: 'Unauthorized' },
      {
        status: 401,
      },
    );
  }
  const cekId = await db.query.lamaran.findFirst({
    where: eq(lamaran.id, Number(id)),
  });

  if (!cekId) {
    return NextResponse.json(
      { status: 'error', error: 'Lamaran tidak ditemukan' },
      {
        status: 404,
      },
    );
  }
  const body: TSchemaLamaran = await request.json();
  const result = editSchema.safeParse(body);
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
  } = body;
  const data = await db
    .update(lamaran)
    .set({
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
    .where(eq(lamaran.id, Number(id)))
    .returning();
  return NextResponse.json({ status: 'success', data });
}
