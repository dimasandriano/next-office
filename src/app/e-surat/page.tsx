'use client';

import { useQuery } from '@tanstack/react-query';
import { DollarSign } from 'lucide-react';
import React from 'react';

import { Card, CardHeader } from '@/components/ui/card';
import Typography from '@/components/ui/typography';

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
              <Typography variant='h3'>Surat Masuk</Typography>
              <DollarSign />
            </div>
            <Typography variant='j1'>{data?.surat}</Typography>
          </CardHeader>
        </Card>
        <Card className='col-span-4'>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <Typography variant='h3'>Divisi</Typography>
              <DollarSign />
            </div>
            <Typography variant='j1'>{data?.divisi}</Typography>
          </CardHeader>
        </Card>
        <Card className='col-span-4'>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <Typography variant='h3'>Kategori</Typography>
              <DollarSign />
            </div>
            <Typography variant='j1'>{data?.kategori}</Typography>
          </CardHeader>
        </Card>
        <Card className='col-span-4'>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <Typography variant='h3'>Lamaran</Typography>
              <DollarSign />
            </div>
            <Typography variant='j1'>{data?.lamaran}</Typography>
          </CardHeader>
        </Card>
        <Card className='col-span-4'>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <Typography variant='h3'>User</Typography>
              <DollarSign />
            </div>
            <Typography variant='j1'>{data?.user}</Typography>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
