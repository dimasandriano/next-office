import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/drizzle/db';
import { divisi } from '@/lib/drizzle/schema/divisi.schema';
import { hashid } from '@/lib/hashid';
import useVerifyJwt from '@/hooks/useVerifyJwt';

export async function DELETE(
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
  const decodeId = hashid.decode(id);
  const cekId = await db.query.divisi.findFirst({
    where: eq(divisi.id, Number(decodeId)),
  });

  if (!cekId) {
    return NextResponse.json(
      { status: 'error', error: 'Divisi tidak ditemukan' },
      {
        status: 404,
      },
    );
  }
  const data = await db
    .delete(divisi)
    .where(eq(divisi.id, Number(decodeId)))
    .returning();
  return NextResponse.json({ status: 'success', data });
}
