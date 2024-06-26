'use client';
import { Printer } from 'lucide-react';
import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

import DisposisiLamaranPdf from '@/components/pdf/disposisi-lamaran.pdf';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { TSchemaLamaran } from '@/types/lamaran.type';

export default function DisposisiCetakModal({
  data,
}: {
  data: TSchemaLamaran;
}) {
  const [open, setOpen] = React.useState(false);
  const contentToPrint = useRef(null);
  const handlePrint = useReactToPrint({
    documentTitle: 'Print This Document',
    removeAfterPrint: true,
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size='icon' variant='ghost'>
          <Printer />
        </Button>
      </DialogTrigger>
      <DialogContent className='flex min-h-[70vh] min-w-[50vw] flex-col'>
        <DialogHeader>
          <DialogTitle>Cetak Disposisi Lamaran {data.pelamar}</DialogTitle>
        </DialogHeader>
        {open && (
          <div ref={contentToPrint}>
            <DisposisiLamaranPdf data={data} />
          </div>
        )}
        <div className='flex items-center justify-between'>
          <DialogClose asChild>
            <Button size='default' variant='ghost' className='w-full'>
              Close
            </Button>
          </DialogClose>
          <Button
            size='default'
            variant='default'
            className='w-full'
            onClick={() => {
              handlePrint(null, () => contentToPrint.current);
            }}
          >
            Cetak
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
