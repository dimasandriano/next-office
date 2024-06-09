/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { format } from 'date-fns';
import { isArray } from 'lodash';
import { Eye } from 'lucide-react';
import { useMemo } from 'react';

import { isJsonString } from '@/lib/isjson';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scrol-area';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

import { TSchemaLamaran } from '@/types/lamaran.type';

type TPendidikan = {
  universitas: string;
  jenjang: string;
  tgllulus: string;
  ipk: string;
  prodi: string;
  gelar: string;
};

export default function LamaranDetailSheet({ data }: { data: TSchemaLamaran }) {
  const pendidikan: TPendidikan[] = useMemo(() => {
    if (isJsonString(data.pendidikan || '')) {
      return JSON.parse(data.pendidikan || '{}');
    } else {
      return [];
    }
  }, [data?.pendidikan]);
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size='icon' variant='outline'>
          <Eye />
        </Button>
      </SheetTrigger>
      <SheetContent className='min-w-[50%]' side='left'>
        <SheetHeader>
          <SheetTitle>Detail Lamaran {data?.pelamar}</SheetTitle>
        </SheetHeader>
        <ScrollArea className='h-[90vh] pt-5'>
          <div className='border-t-2 py-3'>
            <h1 className='text-2xl font-medium'>Personal</h1>
            <div className='grid grid-cols-12 gap-4'>
              <div className='col-span-3'>Tanggal</div>
              <div className='col-span-9'>
                : {format(new Date(data?.tgl_dikirim), 'dd MMMM yyyy')}
              </div>
            </div>
            <div className='grid grid-cols-12 gap-4'>
              <div className='col-span-3'>Pelamar</div>
              <div className='col-span-9'>: {data?.pelamar}</div>
            </div>
            <div className='grid grid-cols-12 gap-4'>
              <div className='col-span-3'>TTL</div>
              <div className='col-span-9'>: {data?.ttl}</div>
            </div>
            <div className='grid grid-cols-12 gap-4'>
              <div className='col-span-3'>No. HP</div>
              <div className='col-span-9'>: {data?.no_hp}</div>
            </div>
          </div>
          <div className='border-t-2 py-3'>
            <h1 className='text-2xl font-medium'>Pendidikan</h1>
            {isArray(pendidikan)
              ? pendidikan?.map((data, index) => (
                  <div key={index} className='pb-3'>
                    <h1 className='text-lg font-medium'>
                      Pendidikan {index + 1}
                    </h1>
                    <div className='grid grid-cols-12 gap-4'>
                      <div className='col-span-3'>Universitas / Sekolah</div>
                      <div className='col-span-9'>
                        : {data?.universitas || '-'}
                      </div>
                    </div>
                    <div className='grid grid-cols-12 gap-4'>
                      <div className='col-span-3'>Prodi / Jurusan</div>
                      <div className='col-span-9'>: {data?.prodi || '-'}</div>
                    </div>
                    <div className='grid grid-cols-12 gap-4'>
                      <div className='col-span-3'>Jenjang</div>
                      <div className='col-span-9'>: {data?.jenjang || '-'}</div>
                    </div>
                    <div className='grid grid-cols-12 gap-4'>
                      <div className='col-span-3'>Gelar</div>
                      <div className='col-span-9'>: {data?.gelar || '-'}</div>
                    </div>
                    <div className='grid grid-cols-12 gap-4'>
                      <div className='col-span-3'>IPK</div>
                      <div className='col-span-9'>: {data?.ipk || '-'}</div>
                    </div>
                    <div className='grid grid-cols-12 gap-4'>
                      <div className='col-span-3'>Tanggal Lulus</div>
                      <div className='col-span-9'>
                        : {format(new Date(data?.tgllulus), 'dd MMMM yyyy')}
                      </div>
                    </div>
                  </div>
                ))
              : '-'}
          </div>
          <div className='border-t-2 py-3'>
            <h1 className='text-2xl font-medium'>Lainnya</h1>
            <div className='grid grid-cols-12 gap-4'>
              <div className='col-span-3'>Status</div>
              <div className='col-span-9'>
                :{' '}
                <Badge variant={data?.status}>
                  {data?.status?.split('_').join(' ')}
                </Badge>
              </div>
            </div>
            <div className='grid grid-cols-12 gap-4'>
              <div className='col-span-3'>Tanggal Dikirim</div>
              <div className='col-span-9'>
                : {format(new Date(data?.tgl_dikirim), 'dd MMMM yyyy')}
              </div>
            </div>
            <div className='grid grid-cols-12 gap-4'>
              <div className='col-span-3'>Lampiran</div>
              <div className='col-span-9'>: {data?.lampiran || '-'}</div>
            </div>
            <div className='grid grid-cols-12 gap-4'>
              <div className='col-span-3'>Keterangan</div>
              <div className='col-span-9'>: {data?.keterangan || '-'}</div>
            </div>
          </div>
          <div className='border-y-2 py-3'>
            <h1 className='text-2xl font-medium'>Dokumen</h1>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
