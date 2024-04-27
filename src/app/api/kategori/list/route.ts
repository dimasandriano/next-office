import { count, ilike } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/drizzle/db';
import { kategori } from '@/lib/drizzle/schema/kategori.schema';
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
  const data = await db.query.kategori.findMany({
    where: ilike(kategori.nama, '%' + search + '%'),
    limit: Number(take),
    offset: (Number(page) - 1) * Number(take),
  });

  const counts = await db
    .select({ value: count() })
    .from(kategori)
    .limit(Number(take))
    .where(ilike(kategori.nama, '%' + search + '%'));
  const pagination = useGeneratePagination(request, counts);
  return NextResponse.json({ status: 'success', data, pagination });
}
