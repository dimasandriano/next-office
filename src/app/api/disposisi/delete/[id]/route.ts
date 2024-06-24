import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/drizzle/db';
import { disposisi } from '@/lib/drizzle/schema/disposisi.schema';
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
  const cekId = await db.query.disposisi.findFirst({
    where: eq(disposisi.id, Number(decodeId)),
  });

  if (!cekId) return BadRequestError('Disposisi tidak ditemukan');
  const data = await db
    .delete(disposisi)
    .where(eq(disposisi.id, Number(decodeId)))
    .returning();
  return NextResponse.json({ status: 'success', data });
}
