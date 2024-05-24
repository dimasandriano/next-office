import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/drizzle/db';
import { kategori } from '@/lib/drizzle/schema/kategori.schema';
import { UnauthorizedError } from '@/lib/exceptions';
import useVerifyJwt from '@/hooks/useVerifyJwt';

import { TSchemaKategori } from '@/types/kategori.type';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  const verify = useVerifyJwt(request);
  if (!verify) return UnauthorizedError();
  const cekId = await db.query.kategori.findFirst({
    where: eq(kategori.id, Number(id)),
  });

  if (!cekId) {
    return NextResponse.json(
      { status: 'error', error: 'Kategori tidak ditemukan' },
      {
        status: 404,
      },
    );
  }
  const body = await request.json();

  const { nama, keterangan }: TSchemaKategori = body;
  const data = await db
    .update(kategori)
    .set({ nama, keterangan })
    .where(eq(kategori.id, Number(id)))
    .returning();
  return NextResponse.json({ status: 'success', data });
}
