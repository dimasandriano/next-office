import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/drizzle/db';
import { kategori } from '@/lib/drizzle/schema/kategori.schema';
import useVerifyJwt from '@/hooks/useVerifyJwt';

export async function POST(request: NextRequest) {
  const verify = useVerifyJwt(request);
  if (!verify) {
    return NextResponse.json(
      { status: 'error', error: 'Unauthorized' },
      {
        status: 401,
      },
    );
  }
  const body = await request.json();
  const { nama, keterangan } = body;
  const data = await db
    .insert(kategori)
    .values({ nama, keterangan })
    .returning();
  return NextResponse.json({ status: 'success', data });
}
