import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/drizzle/db';
import { lamaran } from '@/lib/drizzle/schema/lamaran.schema';
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
  const data = await db
    .delete(lamaran)
    .where(eq(lamaran.id, Number(id)))
    .returning();
  return NextResponse.json({ status: 'success', data });
}
