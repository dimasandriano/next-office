import { and, between, count, eq, ilike } from 'drizzle-orm';
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
  const { take, page, search, status, tipe, start_date, finish_date } =
    useSearchParams(request);
  const data = await db.query.surat.findMany({
    where: and(
      ilike(surat.no_surat, '%' + search + '%'),
      status ? eq(surat.status, status) : undefined,
      tipe ? eq(surat.tipe, tipe) : undefined,
      start_date && finish_date
        ? between(surat.tgl_masuk, new Date(start_date), new Date(finish_date))
        : undefined,
    ),
    limit: take,
    offset: (page - 1) * take,
    with: {
      kategori: true,
      disposisi: true,
    },
    orderBy: (surat, { desc }) => [desc(surat.tgl_masuk)],
  });

  const counts = await db
    .select({ value: count(surat.id) })
    .from(surat)
    .limit(take)
    .where(
      and(
        ilike(surat.no_surat, '%' + search + '%'),
        status ? eq(surat.status, status) : undefined,
        tipe ? eq(surat.tipe, tipe) : undefined,
        start_date && finish_date
          ? between(
              surat.tgl_masuk,
              new Date(start_date),
              new Date(finish_date),
            )
          : undefined,
      ),
    );
  const pagination = useGeneratePagination(request, counts);
  return NextResponse.json({ status: 'success', data, pagination });
}
