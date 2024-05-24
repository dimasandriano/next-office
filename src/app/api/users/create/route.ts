import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { db } from '@/lib/drizzle/db';
import { users } from '@/lib/drizzle/schema/users.schema';
import { UnauthorizedError } from '@/lib/exceptions';
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
  const body: TSchemaUsers = await request.json();
  const result = registerSchema.safeParse(body);
  const { full_name, username, password, role } = body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  if (!result.success) {
    return NextResponse.json(
      {
        status: 'error',
        error: result.error.issues,
      },
      { status: 400 },
    );
  }
  const checkUsername = await db.query.users.findFirst({
    where: eq(users.username, username),
  });

  if (checkUsername) {
    return NextResponse.json(
      {
        status: 'error',
        error: 'Username already exists',
      },
      { status: 400 },
    );
  }
  const data = await db
    .insert(users)
    .values({ full_name, username, password: hashedPassword, role })
    .returning();
  return NextResponse.json({ status: 'success', data });
}
