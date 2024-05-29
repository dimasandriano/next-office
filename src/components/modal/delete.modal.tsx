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
import { userService } from '@/services/user.service';

import { TSchemaDivisi } from '@/types/divisi.type';
import { TSchemaKategori } from '@/types/kategori.type';
import { TSchemaSurat } from '@/types/surat.type';
import { TSchemaUsers } from '@/types/users.type';

interface TDeleteModal {
  surat?: TSchemaSurat;
  kategori?: TSchemaKategori;
  divisi?: TSchemaDivisi;
  users?: TSchemaUsers;
}

/**
 * @example
 * <DeleteModal surat={row.original} />
 */
export function DeleteModal({ surat, kategori, divisi, users }: TDeleteModal) {
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
  const { mutate: deleteUser } = useMutation({
    mutationKey: ['delete-user'],
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: () => {
      toast.success('Hapus Pengguna Berhasil');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: () => {
      toast.error('Hapus Pengguna Gagal');
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
      if (users) {
        deleteUser(id);
        return;
      }
    },
    [
      deleteDivisi,
      deleteKategori,
      deleteSurat,
      deleteUser,
      divisi,
      kategori,
      surat,
      users,
    ],
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
            Hapus {surat && 'Surat'} {kategori && 'Kategori'}{' '}
            {divisi && 'Divisi'} {users && 'Pengguna'}
          </DialogTitle>
          <DialogDescription>
            Apakah anda yakin ingin menghapus {surat && 'surat'}{' '}
            {kategori && 'kategori'} {divisi && 'divisi'} {users && 'pengguna'}{' '}
            ini? <br />
            <span className='block text-center text-lg font-semibold text-red-400'>
              {surat && surat.no_surat}
              {kategori && kategori.nama}
              {divisi && divisi.nama}
              {users && users.username}
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
                if (users) {
                  handleDelete(hashid.encode(users?.id as number));
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
