/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { format } from 'date-fns';
import { isArray } from 'lodash';
import { Eye, SquareArrowOutUpRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import { isJsonString } from '@/lib/isjson';
import { supabase } from '@/lib/supabase';

import { DisposisiSheet } from '@/components/sheet/disposisi.sheet';
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

import { TSchemaSurat } from '@/types/surat.type';

export default function SuratDetailSheet({ data }: { data: TSchemaSurat }) {
  const files: string[] = useMemo(() => {
    if (isJsonString(data.files || '')) {
      return JSON.parse(data.files || '{}');
    } else {
      return [];
    }
  }, [data?.files]);
  const [dataFiles, setDataFiles] = useState<string[]>([]);
  useEffect(() => {
    if (isArray(files)) {
      const data = files.map((file) => {
        const { data } = supabase.storage.from('dokumen').getPublicUrl(file);
        return data.publicUrl;
      });
      setDataFiles(data);
    }
  }, [files]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size='icon' variant='outline'>
          <Eye />
        </Button>
      </SheetTrigger>
      <SheetContent className='min-w-[50%]' side='left'>
        <SheetHeader>
          <SheetTitle>Detail Surat {data?.no_surat}</SheetTitle>
        </SheetHeader>
        <ScrollArea className='h-[90vh] pt-5'>
          <div className='border-t-2 py-3'>
            <div className='flex items-center justify-between'>
              <h1 className='text-2xl font-medium'>Detail</h1>
              <DisposisiSheet surat={data} />
            </div>
            <div className='grid grid-cols-12 gap-4'>
              <div className='col-span-3'>Tipe Surat</div>
              <div className='col-span-9 uppercase'>
                : {data.tipe.replace(/_/g, ' ')}
              </div>
            </div>
            <div className='grid grid-cols-12 gap-4'>
              <div className='col-span-3'>No Surat</div>
              <div className='col-span-9'>: {data.no_surat}</div>
            </div>
            <div className='grid grid-cols-12 gap-4'>
              <div className='col-span-3'>Tanggal Masuk</div>
              <div className='col-span-9'>
                : {format(new Date(data?.tgl_masuk), 'dd MMMM yyyy')}
              </div>
            </div>
            <div className='grid grid-cols-12 gap-4'>
              <div className='col-span-3'>Sifat Surat</div>
              <div className='col-span-9'>
                : <Badge variant={data?.sifat}>{data?.sifat}</Badge>
              </div>
            </div>
            <div className='grid grid-cols-12 gap-4'>
              <div className='col-span-3'>Status Surat</div>
              <div className='col-span-9'>
                : <Badge variant={data?.status}>{data.status}</Badge>
              </div>
            </div>
            <div className='grid grid-cols-12 gap-4'>
              <div className='col-span-3'>Pengirim</div>
              <div className='col-span-9'>: {data?.pengirim}</div>
            </div>
            <div className='grid grid-cols-12 gap-4'>
              <div className='col-span-3'>Kategori</div>
              <div className='col-span-9'>: {data?.kategori?.nama || '-'}</div>
            </div>
            <div className='grid grid-cols-12 gap-4'>
              <div className='col-span-3'>Keterangan</div>
              <div className='col-span-9'>: {data?.keterangan || '-'}</div>
            </div>
            <div className='grid grid-cols-12 gap-4'>
              <div className='col-span-3'>Tanggal Dikirim</div>
              <div className='col-span-9'>
                : {format(new Date(data?.tgl_dikirim), 'dd MMMM yyyy')}
              </div>
            </div>
          </div>
          <div className='border-t-2 py-3'>
            <h1 className='text-2xl font-medium'>Isi Surat</h1>
            {data.tipe === 'surat_keluar' && (
              <div className='grid grid-cols-12 gap-4'>
                <div className='col-span-3'>Peminta</div>
                <div className='col-span-9'>: {data?.peminta || '-'}</div>
              </div>
            )}
            <div className='grid grid-cols-12 gap-4'>
              <div className='col-span-3'>Perihal</div>
              <div className='col-span-9'>: {data?.perihal || '-'}</div>
            </div>
            <div className='grid grid-cols-12 gap-4'>
              <div className='col-span-3'>Ditujukan</div>
              <div className='col-span-9'>: {data?.ditujukan || '-'}</div>
            </div>
            <div className='grid grid-cols-12 gap-4'>
              <div className='col-span-3'>Tanggal Kegiatan</div>
              <div className='col-span-9'>
                : {format(new Date(data?.tgl_kegiatan), 'dd MMMM yyyy')}
              </div>
            </div>
            <div className='grid grid-cols-12 gap-4'>
              <div className='col-span-3'>Nama Kegiatan</div>
              <div className='col-span-9'>: {data?.nama_kegiatan || '-'}</div>
            </div>
            <div className='grid grid-cols-12 gap-4'>
              <div className='col-span-3'>Tempat Kegiatan</div>
              <div className='col-span-9'>: {data?.tempat || '-'}</div>
            </div>
            <div className='grid grid-cols-12 gap-4'>
              <div className='col-span-3'>Jam Kegiatan</div>
              <div className='col-span-9'>: {data?.jam || '-'}</div>
            </div>
          </div>
          <div className='border-y-2 py-3'>
            <h1 className='text-2xl font-medium'>Dokumen</h1>
            <div className='grid grid-cols-12 gap-3'>
              {dataFiles?.map((data, index) => (
                <Button
                  variant='outline'
                  className='col-span-4'
                  key={index}
                  asChild
                >
                  <Link
                    href={data}
                    target='_blank'
                    className='flex items-center gap-2'
                  >
                    <span className='w-10/12 truncate'>{files[index]}</span>
                    <SquareArrowOutUpRight />
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
