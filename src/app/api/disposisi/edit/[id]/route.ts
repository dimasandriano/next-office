import { eq } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { db } from '@/lib/drizzle/db';
import { disposisi } from '@/lib/drizzle/schema/disposisi.schema';
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from '@/lib/exceptions';
import useVerifyJwt from '@/hooks/useVerifyJwt';

import { TSchemaDisposisi } from '@/types/disposisi.type';

const editSchema = createInsertSchema(disposisi, {
  tgl_diterima: z.string().refine((val) => new Date(val) instanceof Date),
});
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  const verify = useVerifyJwt(request);
  if (!verify) return UnauthorizedError();
  const cekId = await db.query.disposisi.findFirst({
    where: eq(disposisi.id, Number(id)),
  });

  if (!cekId) return NotFoundError('Data disposisi tidak ditemukan');
  const body: TSchemaDisposisi = await request.json();
  const result = editSchema.safeParse(body);
  if (!result.success) return BadRequestError(result.error);
  const {
    isi,
    note_pengirim,
    note_penerima,
    tgl_diterima,
    divisi_id,
    lamaran_id,
    surat_id,
  } = body;
  const data = await db
    .update(disposisi)
    .set({
      isi,
      note_pengirim,
      note_penerima,
      tgl_diterima: tgl_diterima && new Date(tgl_diterima),
      divisi_id,
      surat_id,
      lamaran_id,
    })
    .where(eq(disposisi.id, Number(id)))
    .returning();
  return NextResponse.json({ status: 'success', data });
}
