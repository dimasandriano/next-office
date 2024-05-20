'use client';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useParams } from 'next/navigation';
import React from 'react';

import Breadcrumb from '@/components/molecules/Breadcrumb';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

import { suratService } from '@/services/surat.service';

import { TSchemaSurat } from '@/types/surat.type';

export default function Page() {
  const { id } = useParams();

  const { data } = useQuery<TSchemaSurat>({
    queryKey: ['detailsurat', id],
    queryFn: async () => await suratService.getSuratById(id as string),
  });

  const pages = [
    {
      label: 'Surat',
      url: '/e-surat/surat',
    },
    {
      label: 'Detail Surat',
      url: `/e-surat/surat/${id}`,
    },
  ];

  return (
    <div className='space-y-3'>
      <div>
        <Breadcrumb pages={pages} />
        <h1 className='text-2xl font-semibold'>
          Detail Surat {data?.no_surat}
        </h1>
      </div>
      <div className='grid grid-cols-12 gap-3'>
        <Card className='col-span-7 space-y-3 p-3'>
          <div className='grid grid-cols-12 gap-3 border-b pb-3'>
            <div className='col-span-12 space-y-2'>
              <div className='flex items-center justify-between'>
                <h3 className='text-md font-semibold'>No Surat</h3>
                <div className='flex w-5/6 items-center gap-3'>
                  :<p>{data?.no_surat}</p>
                </div>
              </div>
              <div className='flex items-center justify-between'>
                <h3 className='text-md font-semibold'>Tgl Masuk</h3>
                <div className='flex w-5/6 items-center gap-3'>
                  :
                  <p>
                    {data?.tgl_masuk && format(data?.tgl_masuk, 'dd MMMM yyyy')}
                  </p>
                </div>
              </div>
              <div className='flex items-center justify-between'>
                <h3 className='text-md font-semibold'>Sifat</h3>
                <div className='flex w-5/6 items-center gap-3'>
                  :<Badge variant={data?.sifat}>{data?.sifat}</Badge>
                </div>
              </div>
              <div className='flex items-center justify-between'>
                <h3 className='text-md font-semibold'>Pengirim</h3>
                <div className='flex w-5/6 items-center gap-3'>
                  :<p>{data?.pengirim}</p>
                </div>
              </div>
              <div className='flex items-center justify-between'>
                <h3 className='text-md font-semibold'>Kategori</h3>
                <div className='flex w-5/6 items-center gap-3'>
                  :<p>{data?.kategori_id}</p>
                </div>
              </div>
              <div className='flex items-center justify-between'>
                <h3 className='text-md font-semibold'>Status Surat</h3>
                <div className='flex w-5/6 items-center gap-3'>
                  :<Badge variant={data?.status}>{data?.status}</Badge>
                </div>
              </div>
              <div className='flex justify-between'>
                <h3 className='text-md font-semibold'>Keterangan</h3>
                <div className='flex w-5/6 items-start gap-3'>
                  :<p>{data?.keterangan}</p>
                </div>
              </div>
            </div>
          </div>
          <div className='grid grid-cols-12 gap-3 border-b pb-3'>
            <div className='col-span-12 space-y-2'>
              <div className='flex items-center justify-between'>
                <h3 className='text-md font-semibold'>Peminta Surat</h3>
                <div className='flex w-5/6 items-center gap-3'>
                  :<p>{data?.peminta}</p>
                </div>
              </div>
              <div className='flex items-center justify-between'>
                <h3 className='text-md font-semibold'>Perihal</h3>
                <div className='flex w-5/6 items-center gap-3'>
                  :<p>{data?.perihal}</p>
                </div>
              </div>
              <div className='flex items-center justify-between'>
                <h3 className='text-md font-semibold'>Ditujukan</h3>
                <div className='flex w-5/6 items-center gap-3'>
                  :<p>{data?.ditujukan}</p>
                </div>
              </div>
              <div className='flex items-center justify-between'>
                <h3 className='text-md font-semibold'>Tgl Kegiatan</h3>
                <div className='flex w-5/6 items-center gap-3'>
                  :
                  <p>
                    {data?.tgl_kegiatan &&
                      format(data?.tgl_kegiatan, 'EEEE, dd MMMM yyyy')}
                  </p>
                </div>
              </div>
              <div className='flex items-center justify-between'>
                <h3 className='text-md font-semibold'>Nama Kegiatan</h3>
                <div className='flex w-5/6 items-center gap-3'>
                  :<p>{data?.nama_kegiatan}</p>
                </div>
              </div>
              <div className='flex items-center justify-between'>
                <h3 className='text-md font-semibold'>Tempat</h3>
                <div className='flex w-5/6 items-center gap-3'>
                  :<p>{data?.tempat}</p>
                </div>
              </div>
              <div className='flex items-center justify-between'>
                <h3 className='text-md font-semibold'>Jam</h3>
                <div className='flex w-5/6 items-center gap-3'>
                  :<p>{data?.jam}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
        <Card className='col-span-5 h-fit p-3'>
          <div className='grid grid-cols-12 gap-3 border-b pb-3'>
            <div className='col-span-12 space-y-2'>
              <div className='flex items-center justify-between'>
                <h3 className='text-md font-semibold'>Tgl Diterima</h3>
                <div className='flex w-5/6 items-center gap-3'>
                  :
                  <p>
                    {data?.tgl_diterima &&
                      format(data?.tgl_diterima, 'dd MMMM yyyy')}
                  </p>
                </div>
              </div>
              <div className='flex items-center justify-between'>
                <h3 className='text-md font-semibold'>Penerima</h3>
                <div className='flex w-5/6 items-center gap-3'>
                  : <p>{data?.penerima}</p>
                </div>
              </div>
              <div className='flex items-start justify-between'>
                <h3 className='text-md font-semibold'>Isi</h3>
                <div className='flex w-5/6 items-start gap-3'>
                  :<p>{data?.isi}</p>
                </div>
              </div>
              <div className='flex items-center justify-between'>
                <h3 className='text-md font-semibold'>Tgl Dikirim</h3>
                <div className='flex w-5/6 items-center gap-3'>
                  :
                  <p>
                    {data?.tgl_dikirim &&
                      format(data?.tgl_dikirim, 'dd MMMM yyyy')}
                  </p>
                </div>
              </div>
              <div className='flex items-center justify-between'>
                <h3 className='text-md font-semibold'>Lampiran</h3>
                <div className='flex w-5/6 items-center gap-3'>
                  :<p>{data?.lampiran}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
