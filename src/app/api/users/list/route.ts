import { count, ilike } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/drizzle/db';
import { users } from '@/lib/drizzle/schema/users.schema';
import { UnauthorizedError } from '@/lib/exceptions';
import useGeneratePagination from '@/hooks/useGeneratePagination';
import useSearchParams from '@/hooks/useSearchParams';
import useVerifyJwt from '@/hooks/useVerifyJwt';

export async function GET(request: NextRequest) {
  const verify = useVerifyJwt(request);
  if (!verify) return UnauthorizedError();
  const { take, page, search } = useSearchParams(request);
  const data = await db.query.users.findMany({
    where: ilike(users.full_name, '%' + search + '%'),
    limit: Number(take),
    offset: (Number(page) - 1) * Number(take),
    with: {
      division: true,
    },
    columns: {
      password: false,
    },
  });

  const counts = await db
    .select({ value: count(users.id) })
    .from(users)
    .limit(Number(take))
    .where(ilike(users.full_name, '%' + search + '%'));
  const pagination = useGeneratePagination(request, counts);
  return NextResponse.json({ status: 'success', data, pagination });
}
