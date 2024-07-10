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

export default function SifatModal() {
  return (
    <Dialog>
      <DialogTrigger aria-label='Sifat'>
        <CircleHelp size={16} />
      </DialogTrigger>
      <DialogContent className='max-w-xl'>
        <DialogHeader className='mb-5'>
          <DialogTitle>Sifat Surat</DialogTitle>
        </DialogHeader>
        <div className='grid grid-cols-4'>
          <div className='col-span-1'>
            <Badge variant='penting'>Penting</Badge>
          </div>
          <div className='col-span-3'>
            : Surat yang berisi informasi atau instruksi yang harus segera
            diperhatikan dan ditindaklanjuti karena berkaitan dengan kepentingan
            yang signifikan atau urusan yang mendesak
          </div>
        </div>
        <div className='grid grid-cols-4'>
          <div className='col-span-1'>
            <Badge variant='rahasia'>Rahasia</Badge>
          </div>
          <div className='col-span-3'>
            : Surat yang berisi informasi sensitif atau konfidensial yang hanya
            boleh diketahui oleh pihak-pihak tertentu. Keamanan dan kerahasiaan
            isi surat harus dijaga.
          </div>
        </div>
        <div className='grid grid-cols-4'>
          <div className='col-span-1'>
            <Badge variant='segera'>Segera</Badge>
          </div>
          <div className='col-span-3'>
            : Surat yang memerlukan tindakan atau respons cepat karena berkaitan
            dengan urusan yang mendesak atau tenggat waktu yang ketat
          </div>
        </div>
        <div className='grid grid-cols-4'>
          <div className='col-span-1'>
            <Badge variant='biasa'>Biasa</Badge>
          </div>
          <div className='col-span-3'>
            : Surat yang berisi informasi atau komunikasi rutin yang tidak
            memerlukan perhatian khusus atau tindakan segera
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
