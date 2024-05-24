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

import { divisiService } from '@/services/divisi.service';
import { kategoriService } from '@/services/kategori.service';
import { suratService } from '@/services/surat.service';

import { TSchemaDivisi } from '@/types/divisi.type';
import { TSchemaKategori } from '@/types/kategori.type';
import { TSchemaSurat } from '@/types/surat.type';

interface TDeleteModal {
  surat?: TSchemaSurat;
  kategori?: TSchemaKategori;
  divisi?: TSchemaDivisi;
}

/**
 * @example
 * <DeleteModal surat={row.original} />
 */
export function DeleteModal({ surat, kategori, divisi }: TDeleteModal) {
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
  const { mutate: deleteKategori } = useMutation({
    mutationKey: ['delete-kategori'],
    mutationFn: (id: string) => kategoriService.deleteKategori(id),
    onSuccess: () => {
      toast.success('Hapus Kategori Berhasil');
      queryClient.invalidateQueries({ queryKey: ['kategori'] });
    },
    onError: () => {
      toast.error('Hapus Kategori Gagal');
    },
  });
  const { mutate: deleteDivisi } = useMutation({
    mutationKey: ['delete-divisi'],
    mutationFn: (id: string) => divisiService.deleteDivisi(id),
    onSuccess: () => {
      toast.success('Hapus Divisi Berhasil');
      queryClient.invalidateQueries({ queryKey: ['divisi'] });
    },
    onError: () => {
      toast.error('Hapus Divisi Gagal');
    },
  });
  const handleDelete = useCallback(
    (id: string) => {
      if (surat) {
        deleteSurat(id);
        return;
      }
      if (kategori) {
        deleteKategori(id);
        return;
      }
      if (divisi) {
        deleteDivisi(id);
        return;
      }
    },
    [deleteDivisi, deleteKategori, deleteSurat, divisi, kategori, surat],
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
          <DialogTitle>
            Hapus {surat && 'Surat'} {kategori && 'Kategori'}
          </DialogTitle>
          <DialogDescription>
            Apakah anda yakin ingin menghapus {surat && 'surat'}{' '}
            {kategori && 'kategori'} {divisi && 'divisi'} ini? <br />
            <span className='block text-center text-lg font-semibold text-red-400'>
              {surat && surat.no_surat}
              {kategori && kategori.nama}
              {divisi && divisi.nama}
            </span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='flex justify-between'>
          <DialogClose asChild>
            <Button
              type='button'
              variant='destructive'
              className='flex-1'
              onClick={() => {
                if (surat) {
                  handleDelete(hashid.encode(surat?.id as number));
                }
                if (kategori) {
                  handleDelete(hashid.encode(kategori?.id as number));
                }
                if (divisi) {
                  handleDelete(hashid.encode(divisi?.id as number));
                }
              }}
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
