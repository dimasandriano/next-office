import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { db } from '@/lib/drizzle/db';
import { users } from '@/lib/drizzle/schema/users.schema';
import {
  BadRequestError,
  InternalServerError,
  UnauthorizedError,
} from '@/lib/exceptions';
import useDecodedTokenJWT from '@/hooks/useDecodedTokenJWT';
import useVerifyJwt from '@/hooks/useVerifyJwt';

import { TSchemaUsers } from '@/types/users.type';

const registerSchema = createInsertSchema(users, {
  username: z
    .string()
    .min(3)
    .max(50)
    .regex(/^[a-zA-Z0-9]+$/),
});

export async function POST(request: NextRequest) {
  const verify = useVerifyJwt(request);
  if (!verify) return UnauthorizedError();
  const { username: created_by } = useDecodedTokenJWT(request);

  const body: TSchemaUsers = await request.json();
  const { full_name, username, password, role, is_active, divisi_id } = body;

  const result = registerSchema.safeParse(body);
  if (!result.success) return BadRequestError(result.error);

  const checkUsername = await db.query.users.findFirst({
    where: eq(users.username, username),
  });
  if (checkUsername) return BadRequestError('Username already exists');

  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    const data = await db
      .insert(users)
      .values({
        full_name,
        username,
        password: hashedPassword,
        role,
        created_by,
        is_active,
        divisi_id,
      })
      .returning();

    return NextResponse.json({ status: 'success', data });
  } catch {
    return InternalServerError();
  }
}
