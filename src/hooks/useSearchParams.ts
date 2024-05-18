import { NextRequest } from 'next/server';

import { TStatus } from '@/types/status.type';
import { TTipe } from '@/types/tipe.type';

export default function useSearchParams(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const take = searchParams.get('take') || 50;
  const page = searchParams.get('page') || 1;
  const search = searchParams.get('search') || '';
  const status = (searchParams.get('status') as TStatus) || '';
  const tipe = (searchParams.get('tipe') as TTipe) || '';
  const start_date = (searchParams.get('start_date') as Date | string) || '';
  const finish_date = (searchParams.get('finish_date') as Date | string) || '';
  return {
    take: Number(take),
    page: Number(page),
    search,
    status,
    tipe,
    start_date,
    finish_date,
  };
}
