import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/drizzle/db';
import { users } from '@/lib/drizzle/schema/users.schema';
import {
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from '@/lib/exceptions';
import { hashid } from '@/lib/hashid';
import useDecodedTokenJWT from '@/hooks/useDecodedTokenJWT';
import useVerifyJwt from '@/hooks/useVerifyJwt';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  const verify = useVerifyJwt(request);
  if (!verify) return UnauthorizedError();

  const { role } = useDecodedTokenJWT(request);
  const decodeId = hashid.decode(id);
  const cekId = await db.query.users.findFirst({
    where: eq(users.id, Number(decodeId)),
  });
  if (!cekId) return NotFoundError('User not found');

  if (role === 'user')
    return ForbiddenError(
      'Hanya superadmin dan admin yang bisa menghapus user',
    );

  if (role === 'admin' && cekId.role === 'superadmin') {
    return ForbiddenError('Admin tidak boleh menghapus superadmin');
  }

  const data = await db.delete(users).where(eq(users.id, Number(decodeId)));

  return NextResponse.json({ status: 'success', data });
}
