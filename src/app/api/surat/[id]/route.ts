import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/drizzle/db';
import { surat } from '@/lib/drizzle/schema/surat.schema';
import { hashid } from '@/lib/hashid';
import useVerifyJwt from '@/hooks/useVerifyJwt';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const verify = useVerifyJwt(request);
  if (!verify) {
    return NextResponse.json(
      { status: 'error', error: 'Unauthorized' },
      {
        status: 401,
      },
    );
  }
  const { id } = params;
  const decodeId = hashid.decode(id);
  const dataSuratById = await db.query.surat.findFirst({
    where: eq(surat.id, Number(decodeId)),
    with: {
      disposisi: true,
      kategori: true,
    },
  });
  if (!dataSuratById) {
    return NextResponse.json(
      { status: 'error', error: `Surat ${id} tidak ditemukan` },
      {
        status: 404,
      },
    );
  }

  return NextResponse.json({
    status: 'success',
    data: dataSuratById,
  });
}
