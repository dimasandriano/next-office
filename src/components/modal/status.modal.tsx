import { CircleHelp } from 'lucide-react';
import React from 'react';

import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { EStatus } from '@/enums/status.enum';

export default function StatusModal() {
  return (
    <Dialog>
      <DialogTrigger aria-label='Status'>
        <CircleHelp size={16} />
      </DialogTrigger>
      <DialogContent className='max-w-xl'>
        <DialogHeader className='mb-5'>
          <DialogTitle>Status Surat</DialogTitle>
        </DialogHeader>
        <div className='grid grid-cols-4'>
          <div className='col-span-1'>
            <Badge variant={EStatus.enumValues[0]}>
              {EStatus.enumValues[0]}
            </Badge>
          </div>
          <div className='col-span-3'>
            : Surat sedang direview dibagian pelayanan umum
          </div>
        </div>
        <div className='grid grid-cols-4'>
          <div className='col-span-1'>
            <Badge variant={EStatus.enumValues[1]}>
              {EStatus.enumValues[1].replace('_', ' ')}
            </Badge>
          </div>
          <div className='col-span-3'>: Surat sudah naik ke rektor</div>
        </div>
        <div className='grid grid-cols-4'>
          <div className='col-span-1'>
            <Badge variant={EStatus.enumValues[2]}>
              {EStatus.enumValues[2]}
            </Badge>
          </div>
          <div className='col-span-3'>
            : Disposisi sudah disampaikan ke penerima surat
          </div>
        </div>
        <div className='grid grid-cols-4'>
          <div className='col-span-1'>
            <Badge variant={EStatus.enumValues[3]}>
              {EStatus.enumValues[3]}
            </Badge>
          </div>
          <div className='col-span-3'>
            : Disposisi sudah turun & sedang di proses di pelayanan umum
          </div>
        </div>
        <div className='grid grid-cols-4'>
          <div className='col-span-1'>
            <Badge variant={EStatus.enumValues[4]}>
              {EStatus.enumValues[4]}
            </Badge>
          </div>
          <div className='col-span-3'>
            : Surat diarsipkan oleh pelayanan umum
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
