'use client';

import { useMutation } from '@tanstack/react-query';
import { TrashIcon } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
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

import { disposisiService } from '@/services/disposisi.service';
import { divisiService } from '@/services/divisi.service';
import { kategoriService } from '@/services/kategori.service';
import { lamaranService } from '@/services/lamaran.service';
import { suratService } from '@/services/surat.service';
import { userService } from '@/services/user.service';

import { TSchemaDisposisi } from '@/types/disposisi.type';
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
  disposisi?: TSchemaDisposisi;
  isDisposisi?: boolean;
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
  disposisi,
  isDisposisi = false,
}: TDeleteModal) {
  const [open, setOpen] = useState(false);
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
  const { mutate: deleteDisposisi } = useMutation({
    mutationKey: ['delete-disposisi'],
    mutationFn: (id: string) => disposisiService.deleteDisposisi(id),
    onSuccess: () => {
      toast.success('Hapus Disposisi Berhasil');
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ['lamaran'] });
      queryClient.invalidateQueries({ queryKey: ['surat'] });
    },
    onError: () => {
      toast.error('Hapus Disposisi Gagal');
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
      if (disposisi) {
        deleteDisposisi(id);
        return;
      }
    },
    [
      deleteDivisi,
      deleteKategori,
      deleteLamaran,
      deleteSurat,
      deleteUser,
      deleteDisposisi,
      divisi,
      kategori,
      lamaran,
      surat,
      users,
      disposisi,
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
    if (disposisi) {
      return 'Hapus Disposisi' === valueConfirm;
    }
  }, [disposisi, divisi, kategori, lamaran, surat, users, valueConfirm]);

  useEffect(() => {
    if (!open) {
      setValueConfirm('');
    }
  }, [open]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div>
          {disposisi && (
            <Button
              size={disposisi && 'default'}
              variant='destructive'
              type='button'
            >
              {disposisi && 'Hapus Disposisi'}
            </Button>
          )}
          {!isDisposisi && (
            <Button size='icon' variant='destructive' type='button'>
              <TrashIcon />
            </Button>
          )}
        </div>
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
            {lamaran && 'lamaran'}
            {disposisi && 'disposisi'} ini? <br />
            <span className='block text-center text-lg font-semibold text-red-400'>
              {surat && surat.no_surat}
              {kategori && kategori.nama}
              {divisi && divisi.nama}
              {users && users.username}
              {lamaran && lamaran.pelamar}
              {disposisi && 'Hapus Disposisi'}
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
                if (disposisi) {
                  handleDelete(hashid.encode(disposisi?.id as number));
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
