/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useMutation } from '@tanstack/react-query';
import { PenBox } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import queryClient from '@/lib/tanstack';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { kategoriService } from '@/services/kategori.service';

import { TSchemaKategori } from '@/types/kategori.type';

interface TEditModal {
  kategori?: TSchemaKategori;
}

/**
 * @example
 * <EditModal surat={row.original} />
 */
export function EditModal({ kategori }: TEditModal) {
  const form = useForm<TSchemaKategori>({
    mode: 'all',
  });

  React.useEffect(() => {
    form.reset(kategori);
    if (kategori) {
      form.setValue('id', kategori.id);
      form.setValue('nama', kategori.nama);
      form.setValue('keterangan', kategori.keterangan);
    }
  }, [form, kategori]);

  const { mutate: updateKategori } = useMutation({
    mutationKey: ['update-surat'],
    mutationFn: (data: Partial<TSchemaKategori>) =>
      kategoriService.updateKategori(data),
    onSuccess: () => {
      toast.success('Edit Kategori Berhasil');
      queryClient.invalidateQueries({ queryKey: ['kategori'] });
    },
    onError: () => {
      toast.error('Edit Kategori Gagal');
    },
  });

  const handleUpdate = React.useCallback(
    (data: TSchemaKategori) => {
      if (kategori) {
        updateKategori({
          id: kategori.id,
          nama: data.nama,
          keterangan: data.keterangan,
        });
        return;
      }
    },
    [kategori, updateKategori],
  );
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size='icon' variant='default'>
          <PenBox />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Edit {kategori && 'Kategori'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(() => handleUpdate(form.getValues()))}
            className='space-y-3'
          >
            <FormField
              control={form.control}
              name='nama'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Kategori</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Masukkan Nama Kategori'
                      {...(field as any)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='keterangan'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keterangan Kategori</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Masukkan Keterangan Kategori'
                      {...(field as any)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className='flex justify-between'>
              <DialogClose asChild>
                <Button type='button' variant='secondary' className='flex-1'>
                  Close
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button type='submit' variant='default' className='flex-1'>
                  Update
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
