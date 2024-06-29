import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/drizzle/db';
import { disposisi } from '@/lib/drizzle/schema/disposisi.schema';
import { surat } from '@/lib/drizzle/schema/surat.schema';
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
  const cekId = await db.query.surat.findFirst({
    where: eq(surat.id, Number(decodeId)),
  });

  if (!cekId) {
    return NextResponse.json(
      { status: 'error', error: 'Surat tidak ditemukan' },
      {
        status: 404,
      },
    );
  }
  const data = await db
    .delete(surat)
    .where(eq(surat.id, Number(decodeId)))
    .returning();
  if (disposisi.surat_id) {
    await db.delete(disposisi).where(eq(disposisi.surat_id, Number(decodeId)));
  }
  return NextResponse.json({ status: 'success', data });
}
