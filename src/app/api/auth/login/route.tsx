import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { db } from '@/lib/drizzle/db';
import { users } from '@/lib/drizzle/schema/users.schema';

const loginSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(50)
    .regex(/^[a-zA-Z0-9]+$/),
  password: z.string().min(3).max(50),
});

export async function POST(request: Request) {
  const body = await request.json();
  const result = loginSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      {
        status: 'error',
        error: result.error.issues,
      },
      { status: 400 },
    );
  }
  const { username, password } = result.data;

  const user = await db
    .select({
      id: users.id,
      username: users.username,
      password: users.password,
      role: users.role,
      divisi_id: users.divisi_id,
    })
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  if (!user.length) {
    return NextResponse.json(
      {
        status: 'error',
        error: 'Username not found',
      },
      { status: 400 },
    );
  }

  const checkPassword = bcrypt.compareSync(password, user[0].password);

  if (!checkPassword) {
    return NextResponse.json(
      {
        status: 'error',
        error: 'Wrong password',
      },
      { status: 400 },
    );
  }
  const token = jwt.sign(
    {
      id: user[0].id,
      username: user[0].username,
      role: user[0].role,
      divisi_id: user[0].divisi_id,
    },
    (process.env.JWT_SECRET as string) || 'secret',
    {
      expiresIn: '1d',
      algorithm: 'HS256',
    },
  );
  return NextResponse.json({ status: 'success', token });
}
