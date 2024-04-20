import { count, like } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/drizzle/db';
import { users } from '@/lib/drizzle/schema/users.schema';
import useGeneratePagination from '@/hooks/useGeneratePagination';
import useSearchParams from '@/hooks/useSearchParams';

export async function GET(request: NextRequest) {
  const { take, page, search } = useSearchParams(request);
  const data = await db
    .select()
    .from(users)
    .limit(Number(take))
    .offset((Number(page) - 1) * Number(take))
    .where(like(users.full_name, '%' + search + '%'));

  const counts = await db
    .select({ value: count() })
    .from(users)
    .limit(Number(take))
    .where(like(users.full_name, '%' + search + '%'));
  const pagination = useGeneratePagination(request, counts);
  return NextResponse.json({ status: 'success', data, pagination });
}
