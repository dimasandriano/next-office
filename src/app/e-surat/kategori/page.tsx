/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useDebounce, useElementSize } from 'usehooks-ts';

import { toastError } from '@/lib/sonner/toast-error.sonner';
import { KategoriSchemaZod } from '@/lib/zod/kategori.schemaZod';
import getNextPageParam from '@/hooks/getNextPageParam';

import useKategoriColumn from '@/components/columns/kategori.column';
import { TableVirtualized } from '@/components/molecules/TableVirtualized';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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

import { AxiosResError } from '@/types/axios-res-error.type';
import { TSchemaKategori } from '@/types/kategori.type';

export default function Page() {
  const [tableContainerRef, { width: widthTableContainer }] = useElementSize();
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const debounceSearch = useDebounce(search, 1000);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['kategori', debounceSearch],
    queryFn: ({ pageParam = 1 }) =>
      kategoriService.getAllListKategori({
        page: pageParam as number,
        search: debounceSearch,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => getNextPageParam(lastPage),
  });
  const dataKategori: TSchemaKategori[] = React.useMemo(() => {
    return data?.pages.flatMap((page) => page.data || []) || [];
  }, [data]);

  const form = useForm<TSchemaKategori>({
    mode: 'all',
    resolver: zodResolver(KategoriSchemaZod),
  });
  const {
    reset,
    formState: { errors },
    clearErrors,
  } = form;
  const { mutate: mutateCreateKategori, isPending: isPendingCreate } =
    useMutation({
      mutationKey: ['create-kategori'],
      mutationFn: (data: TSchemaKategori) =>
        kategoriService.createKategori(data),
      onSuccess: () => {
        toast.success('Kategori Berhasil');
        refetch();
        setShowCreateModal(false);
        reset();
      },
      onError: (error: AxiosError<AxiosResError>) =>
        toastError('Gagal Membuat Kategori', error),
    });
  useEffect(() => {
    clearErrors();
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearErrors, showCreateModal]);
  const column = useKategoriColumn(widthTableContainer || 0);
  return (
    <div>
      <div className='space-y-3'>
        <h1 className='text-2xl font-semibold'>Kelola Kategori</h1>
        <div className='flex items-center justify-between'>
          <div className='flex w-2/3 items-center justify-between gap-3'>
            <Input
              placeholder='Cari Nama Kategori'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='w-1/4'
            />
          </div>
          <Button variant='default' onClick={() => setShowCreateModal(true)}>
            Tambah Kategori
          </Button>
        </div>
        <div ref={tableContainerRef}>
          <TableVirtualized
            data={dataKategori}
            columns={column}
            loading={isLoading}
            className='max-h-[calc(100vh-210px)] min-h-[calc(100vh-210px)]'
            infiniteScroll={{
              fetchNextPage,
              hasNextPage,
              isFetchingNextPage,
            }}
          />
        </div>
      </div>
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className='max-w-lg'>
          <DialogHeader>
            <DialogTitle>Tambah Kategori</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(() =>
                mutateCreateKategori(form.getValues()),
              )}
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
                <Button
                  type='submit'
                  variant='default'
                  className='flex-1'
                  disabled={
                    errors.nama || errors.keterangan || isPendingCreate
                      ? true
                      : false
                  }
                >
                  Simpan
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
