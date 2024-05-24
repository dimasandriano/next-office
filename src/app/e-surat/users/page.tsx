/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import React from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDebounce, useElementSize } from 'usehooks-ts';

import getNextPageParam from '@/hooks/getNextPageParam';

import useUserColumn from '@/components/columns/user.column';
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
import { userService } from '@/services/user.service';

import { TSchemaDivisi } from '@/types/divisi.type';
import { TSchemaUsers } from '@/types/users.type';

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
    queryKey: ['users', debounceSearch],
    queryFn: ({ pageParam = 1 }) =>
      userService.getAllUser({
        page: pageParam as number,
        search: debounceSearch,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => getNextPageParam(lastPage),
  });
  const dataUser: TSchemaUsers[] = React.useMemo(() => {
    return data?.pages.flatMap((page) => page.data || []) || [];
  }, [data]);

  const form = useForm<TSchemaDivisi>({
    mode: 'all',
  });
  const { mutate: mutateCreateDivisi } = useMutation({
    mutationKey: ['create-divisi'],
    mutationFn: (data: TSchemaDivisi) => divisiService.createDivisi(data),
    onSuccess: () => {
      toast.success('Divisi Berhasil Bertambah');
      refetch();
    },
    onError: () => {
      toast.error('Divisi Gagal Bertambah');
    },
  });

  const column = useUserColumn(widthTableContainer || 0);
  return (
    <div>
      <div className='space-y-3'>
        <h1 className='text-2xl font-semibold'>Kelola Pengguna</h1>
        <div className='flex items-center justify-between'>
          <div className='flex w-2/3 items-center justify-between gap-3'>
            <Input
              placeholder='Cari Nama Pengguna'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='w-1/4'
            />
          </div>
          <Button variant='default' onClick={() => setShowCreateModal(true)}>
            Tambah Pengguna
          </Button>
        </div>
        <div ref={tableContainerRef}>
          <TableVirtualized
            data={dataUser}
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
                mutateCreateDivisi(form.getValues()),
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
                <DialogClose asChild>
                  <Button type='submit' variant='default' className='flex-1'>
                    Simpan
                  </Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
