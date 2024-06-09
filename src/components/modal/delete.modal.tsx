'use client';

import { useMutation } from '@tanstack/react-query';
import { TrashIcon } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
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
import { Input } from '@/components/ui/input';

import { divisiService } from '@/services/divisi.service';
import { kategoriService } from '@/services/kategori.service';
import { lamaranService } from '@/services/lamaran.service';
import { suratService } from '@/services/surat.service';
import { userService } from '@/services/user.service';

import { TSchemaDivisi } from '@/types/divisi.type';
import { TSchemaKategori } from '@/types/kategori.type';
import { TSchemaLamaran } from '@/types/lamaran.type';
import { TSchemaSurat } from '@/types/surat.type';
import { TSchemaUsers } from '@/types/users.type';

interface TDeleteModal {
  surat?: TSchemaSurat;
  kategori?: TSchemaKategori;
  divisi?: TSchemaDivisi;
  users?: TSchemaUsers;
  lamaran?: TSchemaLamaran;
}

/**
 * @example
 * <DeleteModal surat={row.original} />
 */
export function DeleteModal({
  surat,
  kategori,
  divisi,
  users,
  lamaran,
}: TDeleteModal) {
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
  const { mutate: deleteLamaran } = useMutation({
    mutationKey: ['delete-lamaran'],
    mutationFn: (id: string) => lamaranService.deleteLamaran(id),
    onSuccess: () => {
      toast.success('Hapus Lamaran Berhasil');
      queryClient.invalidateQueries({ queryKey: ['lamaran'] });
    },
    onError: () => {
      toast.error('Hapus Lamaran Gagal');
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
      if (lamaran) {
        deleteLamaran(id);
        return;
      }
    },
    [
      deleteDivisi,
      deleteKategori,
      deleteLamaran,
      deleteSurat,
      deleteUser,
      divisi,
      kategori,
      lamaran,
      surat,
      users,
    ],
  );
  const [valueConfirm, setValueConfirm] = useState<string>('');

  const isConfirm = useMemo(() => {
    if (surat) {
      return surat.no_surat === valueConfirm;
    }
    if (kategori) {
      return kategori.nama === valueConfirm;
    }
    if (divisi) {
      return divisi.nama === valueConfirm;
    }
    if (users) {
      return users.username === valueConfirm;
    }
    if (lamaran) {
      return lamaran.pelamar === valueConfirm;
    }
  }, [divisi, kategori, lamaran, surat, users, valueConfirm]);
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
            {divisi && 'Divisi'} {users && 'Pengguna'} {lamaran && 'Lamaran'}
          </DialogTitle>
          <DialogDescription>
            Apakah anda yakin ingin menghapus {surat && 'surat'}{' '}
            {kategori && 'kategori'} {divisi && 'divisi'} {users && 'pengguna'}{' '}
            {lamaran && 'lamaran'} ini? <br />
            <span className='block text-center text-lg font-semibold text-red-400'>
              {surat && surat.no_surat}
              {kategori && kategori.nama}
              {divisi && divisi.nama}
              {users && users.username}
              {lamaran && lamaran.pelamar}
            </span>
          </DialogDescription>
        </DialogHeader>
        <Input
          placeholder='Masukkan Kalimat Merah'
          onChange={(e) => setValueConfirm(e.target.value)}
          value={valueConfirm}
        />
        <DialogFooter className='flex justify-between'>
          <DialogClose asChild>
            <Button
              type='button'
              variant='destructive'
              className='flex-1'
              disabled={!isConfirm}
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
                if (lamaran) {
                  handleDelete(hashid.encode(lamaran?.id as number));
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
