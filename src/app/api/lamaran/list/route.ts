import { and, between, count, eq, ilike } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/drizzle/db';
import { lamaran } from '@/lib/drizzle/schema/lamaran.schema';
import { UnauthorizedError } from '@/lib/exceptions';
import useGeneratePagination from '@/hooks/useGeneratePagination';
import useSearchParams from '@/hooks/useSearchParams';
import useVerifyJwt from '@/hooks/useVerifyJwt';

export async function GET(request: NextRequest) {
  const verify = useVerifyJwt(request);
  if (!verify) return UnauthorizedError();

  const { take, page, search, status, start_date, finish_date } =
    useSearchParams(request);
  const data = await db.query.lamaran.findMany({
    where: and(
      ilike(lamaran.pelamar, '%' + search + '%'),
      status ? eq(lamaran.status, status) : undefined,
      start_date && finish_date
        ? between(lamaran.tgl, new Date(start_date), new Date(finish_date))
        : undefined,
    ),
    limit: Number(take),
    offset: (Number(page) - 1) * Number(take),
    with: {
      disposisi: true,
    },
    orderBy: (lamaran, { desc }) => [desc(lamaran.tgl)],
  });

  const counts = await db
    .select({ value: count(lamaran.id) })
    .from(lamaran)
    .limit(Number(take))
    .where(
      and(
        ilike(lamaran.pelamar, '%' + search + '%'),
        status ? eq(lamaran.status, status) : undefined,
        start_date && finish_date
          ? between(lamaran.tgl, new Date(start_date), new Date(finish_date))
          : undefined,
      ),
    );

  const pagination = useGeneratePagination(request, counts);
  return NextResponse.json({ status: 'success', data, pagination });
}
