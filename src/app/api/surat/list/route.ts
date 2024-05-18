import { and, count, eq, gte, ilike, lte } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/drizzle/db';
import { surat } from '@/lib/drizzle/schema/surat.schema';
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
  const { take, page, search, status, start_date, finish_date } =
    useSearchParams(request);
  const data = await db.query.surat.findMany({
    where: and(
      ilike(surat.no_surat, '%' + search + '%'),
      status ? eq(surat.status, status) : undefined,
      start_date && finish_date
        ? and(
            gte(surat.tgl_masuk, new Date(start_date)),
            lte(surat.tgl_masuk, new Date(finish_date)),
          )
        : undefined,
    ),
    limit: Number(take),
    offset: (Number(page) - 1) * Number(take),
    with: {
      kategori: true,
      disposisi: true,
    },
  });

  const counts = await db
    .select({ value: count(surat.id) })
    .from(surat)
    .limit(Number(take))
    .where(
      and(
        ilike(surat.no_surat, '%' + search + '%'),
        status ? eq(surat.status, status) : undefined,
        start_date && finish_date
          ? and(
              gte(surat.tgl_masuk, new Date(start_date)),
              lte(surat.tgl_masuk, new Date(finish_date)),
            )
          : undefined,
      ),
    );
  const pagination = useGeneratePagination(request, counts);
  return NextResponse.json({ status: 'success', data, pagination });
}
