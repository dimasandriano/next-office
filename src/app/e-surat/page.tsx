'use client';

import { useQuery } from '@tanstack/react-query';
import { addDays, format } from 'date-fns';
import { CalendarIcon, DollarSign } from 'lucide-react';
import React from 'react';
import { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardHeader } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { informationService } from '@/services/information.service';

type Theader = {
  suratMasuk: number;
  suratKeluar: number;
  suratExternal: number;
  kategori: number;
  divisi: number;
  user: number;
  lamaran: number;
};

export default function Page() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const { data } = useQuery<Theader>({
    queryKey: ['information-header', date?.to],
    queryFn: async () =>
      await informationService.informationHeader({
        start_date: date?.from && date.to ? date.from : undefined,
        finish_date: date?.from && date.to ? addDays(date.to, 1) : undefined,
      }),
  });
  return (
    <div className='space-y-3'>
      <div className='flex justify-end'>
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
      <div className='grid grid-cols-12 gap-5'>
        <Card className='col-span-4'>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-semibold'>Surat Masuk</h3>
              <DollarSign />
            </div>
            <h2 className='text-4xl font-bold'>{data?.suratMasuk}</h2>
          </CardHeader>
        </Card>
        <Card className='col-span-4'>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-semibold'>Surat Keluar</h3>
              <DollarSign />
            </div>
            <h2 className='text-4xl font-bold'>{data?.suratKeluar}</h2>
          </CardHeader>
        </Card>
        <Card className='col-span-4'>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-semibold'>Surat External</h3>
              <DollarSign />
            </div>
            <h2 className='text-4xl font-bold'>{data?.suratExternal}</h2>
          </CardHeader>
        </Card>
        <Card className='col-span-4'>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-semibold'>Divisi</h3>
              <DollarSign />
            </div>
            <h2 className='text-4xl font-bold'>{data?.divisi}</h2>
          </CardHeader>
        </Card>
        <Card className='col-span-4'>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-semibold'>Kategori</h3>
              <DollarSign />
            </div>
            <h2 className='text-4xl font-bold'>{data?.kategori}</h2>
          </CardHeader>
        </Card>
        <Card className='col-span-4'>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-semibold'>Lamaran</h3>
              <DollarSign />
            </div>
            <h2 className='text-4xl font-bold'>{data?.lamaran}</h2>
          </CardHeader>
        </Card>
        <Card className='col-span-4'>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-semibold'>User</h3>
              <DollarSign />
            </div>
            <h2 className='text-4xl font-bold'>{data?.user}</h2>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
