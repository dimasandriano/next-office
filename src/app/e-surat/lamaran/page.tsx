'use client';
import { useInfiniteQuery } from '@tanstack/react-query';
import { addDays, format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import React, { useMemo } from 'react';
import { DateRange } from 'react-day-picker';
import { useDebounce, useElementSize } from 'usehooks-ts';

import { cn } from '@/lib/utils';
import getNextPageParam from '@/hooks/getNextPageParam';

import useLamaranColumn from '@/components/columns/lamaran.column';
import { TableVirtualized } from '@/components/molecules/TableVirtualized';
import LamaranCreateSheet from '@/components/sheet/lamaran.create.sheet';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { EStatus } from '@/enums/status.enum';
import { lamaranService } from '@/services/lamaran.service';

import { TSchemaLamaran } from '@/types/lamaran.type';
import { TStatus } from '@/types/status.type';
export default function Page() {
  const [tableContainerRef, { width: widthTableContainer }] = useElementSize();
  const column = useLamaranColumn(widthTableContainer || 0);
  const [search, setSearch] = React.useState('');
  const debounceSearch = useDebounce(search, 1000);
  const [status, setStatus] = React.useState<TStatus | 'all'>();
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['lamaran', debounceSearch, status, date],
      queryFn: async ({ pageParam = 1 }) =>
        await lamaranService.getAllLamaran({
          page: pageParam as number,
          search: debounceSearch,
          status: status === 'all' || !status ? undefined : status,
          start_date: date?.from && date.to ? date.from : undefined,
          finish_date: date?.from && date.to ? addDays(date.to, 1) : undefined,
        }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => getNextPageParam(lastPage),
    });
  const dataLamaran: TSchemaLamaran[] = useMemo(() => {
    return data?.pages.flatMap((page) => page.data || []) || [];
  }, [data?.pages]);

  return (
    <div className='space-y-3'>
      <h1 className='text-2xl font-semibold'>Kelola Lamaran</h1>
      <div className='flex items-center justify-between'>
        <div className='flex w-2/5 items-center justify-between gap-3'>
          <Input
            placeholder='Cari Nama Pelamar'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='w-1/3'
          />
          <Select value={status} onValueChange={(e) => setStatus(e as TStatus)}>
            <SelectTrigger className='w-1/3'>
              <SelectValue placeholder='Filter Status' />
            </SelectTrigger>
            <SelectContent>
              {status && <SelectItem value='all'>SEMUA</SelectItem>}
              {EStatus.enumValues.map((status) => (
                <SelectItem value={status} key={status}>
                  {status?.split('_').join(' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild className='w-1/3'>
              <Button
                id='date'
                variant='outline'
                className={cn(
                  'w-[300px] justify-start text-left font-normal',
                  !date && 'text-muted-foreground',
                )}
              >
                <CalendarIcon className='mr-2 h-4 w-4' />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, 'dd MMM yyyy')} -{' '}
                      {format(date.to, 'dd MMM yyyy')}
                    </>
                  ) : (
                    format(date.from, 'dd MMM yyyy')
                  )
                ) : (
                  <span>Pilih Tanggal</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0' align='start'>
              <Calendar
                initialFocus
                mode='range'
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
        <LamaranCreateSheet />
      </div>
      <div ref={tableContainerRef}>
        <TableVirtualized
          data={dataLamaran}
          columns={column}
          loading={isLoading}
          className='max-h-[calc(100vh-210px)] min-h-[calc(100vh-210px)]'
          infiniteScroll={{
            fetchNextPage,
            hasNextPage,
            isFetchingNextPage,
          }}
        />
      </div>
    </div>
  );
}
