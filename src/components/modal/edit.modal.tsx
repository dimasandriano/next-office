/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { PenBox } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import queryClient from '@/lib/tanstack';
import { DivisiSchemaZod } from '@/lib/zod/divisi.schemaZod';
import { KategoriSchemaZod } from '@/lib/zod/kategori.schemaZod';

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

import { divisiService } from '@/services/divisi.service';
import { kategoriService } from '@/services/kategori.service';

import { TSchemaDivisi } from '@/types/divisi.type';
import { TSchemaKategori } from '@/types/kategori.type';

interface TEditModal {
  kategori?: TSchemaKategori;
  divisi?: TSchemaDivisi;
}

/**
 * @example
 * <EditModal surat={row.original} />
 */
export function EditModal({ kategori, divisi }: TEditModal) {
  const [open, setOpen] = React.useState(false);
  const form = useForm<TSchemaKategori | TSchemaDivisi>({
    mode: 'all',
    resolver: zodResolver(kategori ? KategoriSchemaZod : DivisiSchemaZod),
  });
  const {
    formState: { errors },
  } = form;
  React.useEffect(() => {
    form.reset(kategori);
    form.reset(divisi);
    if (kategori) {
      form.setValue('id', kategori.id);
      form.setValue('nama', kategori.nama);
      form.setValue('keterangan', kategori.keterangan);
    }
    if (divisi) {
      form.setValue('id', divisi.id);
      form.setValue('nama', divisi.nama);
      form.setValue('keterangan', divisi.keterangan);
    }
  }, [divisi, form, kategori]);

  const { mutate: updateKategori, isPending: isLoadingKategori } = useMutation({
    mutationKey: ['update-surat'],
    mutationFn: (data: Partial<TSchemaKategori>) =>
      kategoriService.updateKategori(data),
    onSuccess: () => {
      toast.success('Edit Kategori Berhasil');
      queryClient.invalidateQueries({ queryKey: ['kategori'] });
      setOpen(false);
    },
    onError: () => {
      toast.error('Edit Kategori Gagal');
    },
  });
  const { mutate: updateDivisi, isPending: isLoadingDivisi } = useMutation({
    mutationKey: ['update-divisi'],
    mutationFn: (data: Partial<TSchemaDivisi>) =>
      divisiService.updateDivisi(data),
    onSuccess: () => {
      toast.success('Edit Divisi Berhasil');
      queryClient.invalidateQueries({ queryKey: ['divisi'] });
      setOpen(false);
    },
    onError: () => {
      toast.error('Edit Divisi Gagal');
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
      if (divisi) {
        updateDivisi({
          id: divisi.id,
          nama: data.nama,
          keterangan: data.keterangan,
        });
        return;
      }
    },
    [divisi, kategori, updateDivisi, updateKategori],
  );
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size='icon' variant='default'>
          <PenBox />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>
            Edit {kategori && 'Kategori'} {divisi && 'Divisi'}
          </DialogTitle>
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
                  <FormLabel>
                    Nama {kategori ? 'Kategori' : ''} {divisi ? 'Divisi' : ''}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={`Masukkan Nama ${kategori ? 'Kategori' : ''}${
                        divisi ? 'Divisi' : ''
                      }`}
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
                  <FormLabel>
                    Keterangan {kategori ? 'Kategori' : ''}{' '}
                    {divisi ? 'Divisi' : ''}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={`Masukkan Keterangan ${kategori ? 'Kategori' : ''}${
                        divisi ? 'Divisi' : ''
                      }`}
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
              <Button
                type='submit'
                variant='default'
                className='flex-1'
                disabled={
                  errors.nama ||
                  errors.keterangan ||
                  isLoadingKategori ||
                  isLoadingDivisi
                    ? true
                    : false
                }
              >
                Update
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
