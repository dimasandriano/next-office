import { count, like } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/drizzle/db';
import { users } from '@/lib/drizzle/schema/users.schema';
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
  const data = await db.query.users.findMany({
    where: like(users.full_name, '%' + search + '%'),
    limit: Number(take),
    offset: (Number(page) - 1) * Number(take),
    with: {
      division: true,
    },
  });

  const counts = await db
    .select({ value: count() })
    .from(users)
    .limit(Number(take))
    .where(like(users.full_name, '%' + search + '%'));
  const pagination = useGeneratePagination(request, counts);
  return NextResponse.json({ status: 'success', data, pagination });
}
