import { createInsertSchema } from 'drizzle-zod';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { db } from '@/lib/drizzle/db';
import { surat } from '@/lib/drizzle/schema/surat.schema';
import useVerifyJwt from '@/hooks/useVerifyJwt';

import { TSchemaSurat } from '@/types/surat.type';

const createSchema = createInsertSchema(surat, {
  tgl_masuk: z.string().refine((val) => new Date(val) instanceof Date),
  tgl_kegiatan: z.string().refine((val) => new Date(val) instanceof Date),
  tgl_dikirim: z.string().refine((val) => new Date(val) instanceof Date),
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
  const body: TSchemaSurat = await request.json();
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
    .insert(surat)
    .values({
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
      tgl_dikirim: new Date(tgl_dikirim),
      tgl_diterima: tgl_diterima && new Date(tgl_diterima),
      tgl_kegiatan: new Date(tgl_kegiatan),
      tgl_masuk: new Date(tgl_masuk),
      tipe,
    })
    .returning();
  return NextResponse.json({ status: 'success', data });
}
