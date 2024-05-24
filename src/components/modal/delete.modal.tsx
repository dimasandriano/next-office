'use client';

import { useMutation } from '@tanstack/react-query';
import { TrashIcon } from 'lucide-react';
import { useCallback } from 'react';
import toast from 'react-hot-toast';

import { hashid } from '@/lib/hashid';
import queryClient from '@/lib/tanstack';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { suratService } from '@/services/surat.service';

import { TSchemaSurat } from '@/types/surat.type';

interface TDeleteModal {
  surat?: TSchemaSurat;
}

/**
 * @example
 * <DeleteModal surat={row.original} />
 */
export function DeleteModal({ surat }: TDeleteModal) {
  const { mutate: deleteSurat } = useMutation({
    mutationKey: ['delete-surat'],
    mutationFn: (id: string) => suratService.deleteSurat(id),
    onSuccess: () => {
      toast.success('Hapus Surat Berhasil');
      queryClient.invalidateQueries({ queryKey: ['surat'] });
    },
    onError: () => {
      toast.error('Hapus Surat Gagal');
    },
  });
  const handleDelete = useCallback(
    (id: string) => {
      if (surat) {
        deleteSurat(id);
        return;
      }
    },
    [deleteSurat, surat],
  );
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size='icon' variant='destructive'>
          <TrashIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Hapus {surat && 'Surat'}</DialogTitle>
          <DialogDescription>
            Apakah anda yakin ingin menghapus {surat && 'surat'} ini? <br />
            <span className='block text-center text-lg font-semibold text-red-400'>
              {surat && surat.no_surat}
            </span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='flex justify-between'>
          <DialogClose asChild>
            <Button
              type='button'
              variant='destructive'
              className='flex-1'
              onClick={() => handleDelete(hashid.encode(surat?.id as number))}
            >
              Hapus
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type='button' variant='secondary' className='flex-1'>
              Tidak
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
