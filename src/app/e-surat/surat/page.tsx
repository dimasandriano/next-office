'use client';
import { useInfiniteQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import React, { useMemo } from 'react';
import { DateRange } from 'react-day-picker';
import { useDebounce, useElementSize } from 'usehooks-ts';

import { cn } from '@/lib/utils';
import getNextPageParam from '@/hooks/getNextPageParam';

import useSuratColumn from '@/components/columns/surat.column';
import { TableVirtualized } from '@/components/molecules/TableVirtualized';
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
import { ETipe } from '@/enums/tipe.enum';
import { suratService } from '@/services/surat.service';

import { TStatus } from '@/types/status.type';
import { TSchemaSurat } from '@/types/surat.type';
import { TTipe } from '@/types/tipe.type';
export default function Page() {
  const [tableContainerRef, { width: widthTableContainer }] = useElementSize();
  const column = useSuratColumn(widthTableContainer || 0);
  const [search, setSearch] = React.useState('');
  const debounceSearch = useDebounce(search, 1000);
  const [status, setStatus] = React.useState<TStatus | 'all'>();
  const [tipe, setTipe] = React.useState<TTipe | 'all'>();
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['surat', debounceSearch, status, date, tipe],
      queryFn: async ({ pageParam = 1 }) =>
        await suratService.getAllSurat({
          page: pageParam as number,
          search: debounceSearch,
          status: status === 'all' || !status ? undefined : status,
          tipe: tipe === 'all' || !tipe ? undefined : tipe,
          start_date: date?.from && date.to ? date.from : undefined,
          finish_date: date?.from && date.to ? date.to : undefined,
        }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => getNextPageParam(lastPage),
    });
  const dataSurat: TSchemaSurat[] = useMemo(() => {
    return data?.pages.flatMap((page) => page.data || []) || [];
  }, [data?.pages]);

  return (
    <div className='space-y-3'>
      <h1 className='text-2xl font-semibold'>Kelola Surat</h1>
      <div className='flex items-center justify-between'>
        <div className='flex w-2/3 items-center justify-between gap-3'>
          <Input
            placeholder='Cari Surat'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='w-1/4'
          />
          <Select value={tipe} onValueChange={(e) => setTipe(e as TTipe)}>
            <SelectTrigger className='w-1/4'>
              <SelectValue placeholder='Filter Tipe' />
            </SelectTrigger>
            <SelectContent>
              {tipe && <SelectItem value='all'>SEMUA</SelectItem>}
              {ETipe.enumValues.map((tipe) => {
                if (tipe === 'lamaran') return;
                return (
                  <SelectItem value={tipe} key={tipe} className='uppercase'>
                    {tipe.split('_').join(' ')}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={(e) => setStatus(e as TStatus)}>
            <SelectTrigger className='w-1/4'>
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
            <PopoverTrigger asChild className='w-1/4'>
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
        <Button variant='default'>Tambah Surat</Button>
      </div>
      <div ref={tableContainerRef}>
        <TableVirtualized
          data={dataSurat}
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
