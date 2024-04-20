import { NextRequest } from 'next/server';

export default function useSearchParams(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const take = searchParams.get('take') || 50;
  const page = searchParams.get('page') || 1;
  const search = searchParams.get('search') || '';
  return {
    take: Number(take),
    page: Number(page),
    search,
  };
}
