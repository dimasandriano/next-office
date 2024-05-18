'use client';

import { useQuery } from '@tanstack/react-query';
import { DollarSign } from 'lucide-react';
import React from 'react';

import { Card, CardHeader } from '@/components/ui/card';

import { informationService } from '@/services/information.service';

type Theader = {
  surat: number;
  kategori: number;
  divisi: number;
  user: number;
  lamaran: number;
};

export default function Page() {
  const { data } = useQuery<Theader>({
    queryKey: ['information-header'],
    queryFn: async () => await informationService.informationHeader(),
  });

  return (
    <div>
      <div className='grid grid-cols-12 gap-5'>
        <Card className='col-span-4'>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-semibold'>Surat Masuk</h3>
              <DollarSign />
            </div>
            <h2 className='text-4xl font-bold'>{data?.surat}</h2>
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
