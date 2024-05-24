import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/drizzle/db';
import { disposisi } from '@/lib/drizzle/schema/disposisi.schema';
import { UnauthorizedError } from '@/lib/exceptions';
import useVerifyJwt from '@/hooks/useVerifyJwt';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  const verify = useVerifyJwt(request);
  if (!verify) return UnauthorizedError();
  const cekId = await db.query.disposisi.findFirst({
    where: eq(disposisi.id, Number(id)),
  });

  if (!cekId) {
    return NextResponse.json(
      { status: 'error', error: 'Disposisi tidak ditemukan' },
      {
        status: 404,
      },
    );
  }
  const data = await db
    .delete(disposisi)
    .where(eq(disposisi.id, Number(id)))
    .returning();
  return NextResponse.json({ status: 'success', data });
}
