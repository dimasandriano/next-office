import { eq } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/drizzle/db';
import { divisi } from '@/lib/drizzle/schema/divisi.schema';
import useVerifyJwt from '@/hooks/useVerifyJwt';

import { TSchemaDivisi } from '@/types/divisi.type';
const editSchema = createInsertSchema(divisi, {});
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
  const cekId = await db.query.divisi.findFirst({
    where: eq(divisi.id, Number(id)),
  });

  if (!cekId) {
    return NextResponse.json(
      { status: 'error', error: 'Divisi tidak ditemukan' },
      {
        status: 404,
      },
    );
  }
  const body = await request.json();
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
  const { nama, keterangan }: TSchemaDivisi = body;
  const data = await db
    .update(divisi)
    .set({ nama, keterangan })
    .where(eq(divisi.id, Number(id)))
    .returning();
  return NextResponse.json({ status: 'success', data });
}
