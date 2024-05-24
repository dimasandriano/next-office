import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/drizzle/db';
import { kategori } from '@/lib/drizzle/schema/kategori.schema';
import { UnauthorizedError } from '@/lib/exceptions';
import { hashid } from '@/lib/hashid';
import useVerifyJwt from '@/hooks/useVerifyJwt';
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  const verify = useVerifyJwt(request);
  if (!verify) return UnauthorizedError();
  const decodeId = hashid.decode(id);
  const cekId = await db.query.kategori.findFirst({
    where: eq(kategori.id, Number(decodeId)),
  });

  if (!cekId) {
    return NextResponse.json(
      { status: 'error', error: 'Kategori tidak ditemukan' },
      {
        status: 404,
      },
    );
  }
  const data = await db
    .delete(kategori)
    .where(eq(kategori.id, Number(decodeId)))
    .returning();
  return NextResponse.json({ status: 'success', data });
}
