import { NextRequest } from 'next/server';

import { TPagination } from '@/types/pagination.type';

export default function useGeneratePagination(
  request: NextRequest,
  counts: { value: number }[],
): TPagination {
  const searchParams = request.nextUrl.searchParams;
  const take = searchParams.get('take') || 50;
  const page = searchParams.get('page') || 1;
  const pagination = {
    page: Number(page),
    take: Number(take),
    item_count: counts[0]?.value,
    page_count: Math.ceil(counts[0]?.value / Number(take)),
    has_previous_page: Number(page) > 1,
    has_next_page: Number(page) < Math.ceil(counts[0]?.value / Number(take)),
  };
  return pagination;
}
