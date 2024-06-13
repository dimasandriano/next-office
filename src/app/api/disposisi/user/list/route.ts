import { count, eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/drizzle/db';
import { disposisi } from '@/lib/drizzle/schema/disposisi.schema';
import { UnauthorizedError } from '@/lib/exceptions';
import useDecodedTokenJWT from '@/hooks/useDecodedTokenJWT';
import useGeneratePagination from '@/hooks/useGeneratePagination';
import useSearchParams from '@/hooks/useSearchParams';
import useVerifyJwt from '@/hooks/useVerifyJwt';

export async function GET(request: NextRequest) {
  const verify = useVerifyJwt(request);
  if (!verify) return UnauthorizedError();

  const { take, page } = useSearchParams(request);
  const { divisi_id } = useDecodedTokenJWT(request);

  const data = await db.query.disposisi.findMany({
    limit: Number(take),
    offset: (Number(page) - 1) * Number(take),
    where: eq(disposisi.divisi_id, Number(divisi_id)),
    with: {
      divisi: true,
      surat: true,
      lamaran: true,
    },
  });

  const counts = await db
    .select({ value: count(disposisi.id) })
    .from(disposisi)
    .where(eq(disposisi.divisi_id, Number(divisi_id)))
    .limit(Number(take));

  const pagination = useGeneratePagination(request, counts);
  return NextResponse.json({ status: 'success', data, pagination });
}
