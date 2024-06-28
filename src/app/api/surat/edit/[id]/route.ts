import { eq } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { fromError } from 'zod-validation-error';

import { db } from '@/lib/drizzle/db';
import { surat } from '@/lib/drizzle/schema/surat.schema';
import { BadRequestError, UnauthorizedError } from '@/lib/exceptions';
import useVerifyJwt from '@/hooks/useVerifyJwt';

import { TSchemaSurat } from '@/types/surat.type';

const editSchema = createInsertSchema(surat, {
  tgl_masuk: z.string().refine((val) => new Date(val) instanceof Date),
  tgl_kegiatan: z.string().refine((val) => new Date(val) instanceof Date),
  tgl_dikirim: z.string().refine((val) => new Date(val) instanceof Date),
  tgl_diterima: z.string().refine((val) => new Date(val) instanceof Date),
});
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  const verify = useVerifyJwt(request);
  if (!verify) return UnauthorizedError();
  const cekId = await db.query.surat.findFirst({
    where: eq(surat.id, Number(id)),
  });

  if (!cekId) {
    return NextResponse.json(
      { status: 'error', error: 'Surat tidak ditemukan' },
      {
        status: 404,
      },
    );
  }
  const body: TSchemaSurat = await request.json();
  const result = editSchema.safeParse(body);
  if (!result.success)
    return BadRequestError(fromError(result.error).toString());
  const {
    no_surat,
    files,
    isi,
    jam,
    keterangan,
    lampiran,
    nama_kegiatan,
    peminta,
    penerima,
    pengirim,
    perihal,
    sifat,
    status,
    tempat,
    kategori_id,
    tgl_dikirim,
    tgl_diterima,
    tgl_kegiatan,
    tgl_masuk,
    tipe,
  } = body;

  const data = await db
    .update(surat)
    .set({
      no_surat,
      files,
      isi,
      jam,
      keterangan,
      lampiran,
      nama_kegiatan,
      peminta,
      penerima,
      pengirim,
      perihal,
      sifat,
      status,
      tempat,
      kategori_id,
      tgl_dikirim: tgl_dikirim && new Date(tgl_dikirim),
      tgl_diterima: tgl_diterima && new Date(tgl_diterima),
      tgl_kegiatan: tgl_kegiatan && new Date(tgl_kegiatan),
      tgl_masuk: tgl_masuk && new Date(tgl_masuk),
      tipe,
    })
    .where(eq(surat.id, Number(id)));
  return NextResponse.json({ status: 'success', data });
}
