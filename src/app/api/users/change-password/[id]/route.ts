import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import * as z from 'zod';
import { fromError } from 'zod-validation-error';

import { db } from '@/lib/drizzle/db';
import { users } from '@/lib/drizzle/schema/users.schema';
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from '@/lib/exceptions';
import { hashid } from '@/lib/hashid';
import useDecodedTokenJWT from '@/hooks/useDecodedTokenJWT';
import useVerifyJwt from '@/hooks/useVerifyJwt';

const changePasswordSchema = z.object({
  password_old: z.string().min(8),
  password_new: z.string().min(8),
  password_confirm: z.string().min(8),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  const verify = useVerifyJwt(request);
  if (!verify) return UnauthorizedError();

  const body = await request.json();
  const { password_new, password_confirm, password_old } = body;
  const result = changePasswordSchema.safeParse(body);
  if (!result.success)
    return BadRequestError(fromError(result.error).toString());

  const { role } = useDecodedTokenJWT(request);

  const decodeId = hashid.decode(id);
  const cekId = await db.query.users.findFirst({
    where: eq(users.id, Number(decodeId)),
  });
  if (!cekId) return NotFoundError('User not found');

  if (role === 'user')
    return ForbiddenError(
      'Hanya superadmin dan admin yang bisa merubah password',
    );

  if (role === 'admin' && cekId.role === 'superadmin') {
    return ForbiddenError('Admin tidak boleh merubah password superadmin');
  }

  const checkPassword = bcrypt.compareSync(password_old, cekId.password);
  if (!checkPassword) return BadRequestError('Wrong password');

  if (password_new !== password_confirm) {
    return BadRequestError('Password baru tidak sama');
  }

  const data = await db
    .update(users)
    .set({
      password: await bcrypt.hash(password_new, 10),
    })
    .where(eq(users.id, Number(decodeId)));

  return NextResponse.json({ status: 'success', data });
}
