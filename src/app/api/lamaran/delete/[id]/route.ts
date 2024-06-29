import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/drizzle/db';
import { disposisi } from '@/lib/drizzle/schema/disposisi.schema';
import { lamaran } from '@/lib/drizzle/schema/lamaran.schema';
import { BadRequestError, UnauthorizedError } from '@/lib/exceptions';
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
  const cekId = await db.query.lamaran.findFirst({
    where: eq(lamaran.id, Number(decodeId)),
  });

  if (!cekId) return BadRequestError('Lamaran tidak ditemukan');
  const data = await db
    .delete(lamaran)
    .where(eq(lamaran.id, Number(decodeId)))
    .returning();
  if (disposisi.lamaran_id) {
    await db
      .delete(disposisi)
      .where(eq(disposisi.lamaran_id, Number(decodeId)));
  }
  return NextResponse.json({ status: 'success', data });
}
