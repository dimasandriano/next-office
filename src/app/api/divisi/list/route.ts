import { count, ilike } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/drizzle/db';
import { divisi } from '@/lib/drizzle/schema/divisi.schema';
import useGeneratePagination from '@/hooks/useGeneratePagination';
import useSearchParams from '@/hooks/useSearchParams';
import useVerifyJwt from '@/hooks/useVerifyJwt';

export async function GET(request: NextRequest) {
  const verify = useVerifyJwt(request);
  if (!verify) {
    return NextResponse.json(
      { status: 'error', error: 'Unauthorized' },
      {
        status: 401,
      },
    );
  }
  const { take, page, search } = useSearchParams(request);
  const data = await db.query.divisi.findMany({
    where: ilike(divisi.nama, '%' + search + '%'),
    limit: Number(take),
    offset: (Number(page) - 1) * Number(take),
  });

  const counts = await db
    .select({ value: count(divisi.id) })
    .from(divisi)
    .limit(Number(take))
    .where(ilike(divisi.nama, '%' + search + '%'));
  const pagination = useGeneratePagination(request, counts);
  return NextResponse.json({ status: 'success', data, pagination });
}
