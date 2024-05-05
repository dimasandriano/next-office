import { eq } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { db } from '@/lib/drizzle/db';
import { users } from '@/lib/drizzle/schema/users.schema';
import useVerifyJwt from '@/hooks/useVerifyJwt';

const editSchema = createInsertSchema(users, {
  username: z
    .string()
    .min(3)
    .max(50)
    .regex(/^[a-zA-Z0-9]+$/),
  password: z.nullable(z.string().min(3).max(200)).optional(),
});
import bcrypt from 'bcryptjs';

import { TSchemaUsers } from '@/types/users.type';

export async function PUT(
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
  const body: TSchemaUsers = await request.json();
  const result = editSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      {
        status: 'error',
        error: result.error.issues,
      },
      { status: 400 },
    );
  }
  const { full_name, username, password, role, is_active } = body;

  const userID = await db.query.users.findFirst({
    where: eq(users.id, Number(id)),
  });

  if (userID?.username !== username) {
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
  }

  if (password) {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const data = await db
      .update(users)
      .set({ full_name, username, password: hashedPassword, role, is_active })
      .where(eq(users.id, Number(id)));
    return NextResponse.json({ status: 'success', data });
  }

  const data = await db
    .update(users)
    .set({ full_name, username, role, is_active })
    .where(eq(users.id, Number(id)));
  return NextResponse.json({ status: 'success', data });
}
