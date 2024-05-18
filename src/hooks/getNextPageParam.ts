import { TPagination } from '@/types/pagination.type';

export default function getNextPageParam(lastPage: {
  pagination: TPagination;
}) {
  const { pagination } = lastPage as { pagination: TPagination };
  return pagination?.has_next_page ? pagination?.page + 1 : undefined;
}
