/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import React, { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDebounce, useElementSize } from 'usehooks-ts';

import { DivisiSchemaZod } from '@/lib/zod/divisi.schemaZod';
import getNextPageParam from '@/hooks/getNextPageParam';

import useDivisiColumn from '@/components/columns/divisi.column';
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

import { divisiService } from '@/services/divisi.service';

import { TSchemaDivisi } from '@/types/divisi.type';

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
    queryKey: ['divisi', debounceSearch],
    queryFn: ({ pageParam = 1 }) =>
      divisiService.getAllDivisi({
        page: pageParam as number,
        search: debounceSearch,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => getNextPageParam(lastPage),
  });
  const dataDivisi: TSchemaDivisi[] = React.useMemo(() => {
    return data?.pages.flatMap((page) => page.data || []) || [];
  }, [data]);

  const form = useForm<TSchemaDivisi>({
    mode: 'all',
    resolver: zodResolver(DivisiSchemaZod),
  });

  const {
    reset,
    formState: { errors },
    clearErrors,
  } = form;
  const { mutate: mutateCreateDivisi, isPending: isPendingCreate } =
    useMutation({
      mutationKey: ['create-divisi'],
      mutationFn: (data: TSchemaDivisi) => divisiService.createDivisi(data),
      onSuccess: () => {
        toast.success('Divisi Berhasil Bertambah');
        reset();
        refetch();
        setShowCreateModal(false);
      },
      onError: () => {
        toast.error('Divisi Gagal Bertambah');
      },
    });

  const handleCreateDivisi = useCallback(
    (data: TSchemaDivisi) => {
      mutateCreateDivisi(data);
    },
    [mutateCreateDivisi],
  );
  useEffect(() => {
    clearErrors();
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearErrors, showCreateModal]);
  const column = useDivisiColumn(widthTableContainer || 0);
  return (
    <div>
      <div className='space-y-3'>
        <h1 className='text-2xl font-semibold'>Kelola Divisi</h1>
        <div className='flex items-center justify-between'>
          <div className='flex w-2/3 items-center justify-between gap-3'>
            <Input
              placeholder='Cari Nama Divisi'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='w-1/4'
            />
          </div>
          <Button variant='default' onClick={() => setShowCreateModal(true)}>
            Tambah Divisi
          </Button>
        </div>
        <div ref={tableContainerRef}>
          <TableVirtualized
            data={dataDivisi}
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
            <DialogTitle>Tambah Divisi</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(() =>
                handleCreateDivisi(form.getValues()),
              )}
              className='space-y-3'
            >
              <FormField
                control={form.control}
                name='nama'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Divisi</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Masukkan Nama Divisi'
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
                    <FormLabel>Keterangan Divisi</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Masukkan Keterangan Divisi'
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
