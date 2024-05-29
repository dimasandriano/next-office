/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { ERole } from '@/enums/role.enum';
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

  const form = useForm<TSchemaUsers>({
    mode: 'all',
  });
  const { mutate: mutateCreateUser } = useMutation({
    mutationKey: ['create-user'],
    mutationFn: (data: TSchemaUsers) => userService.createUser(data),
    onSuccess: () => {
      toast.success('Pengguna Berhasil Bertambah');
      refetch();
    },
    onError: () => {
      toast.error('Pengguna Gagal Bertambah');
    },
  });
  const { data: dataDivisi } = useQuery<TSchemaDivisi[]>({
    queryKey: ['divisi'],
    queryFn: () => divisiService.getAllDivisiSelection(),
  });
  const onSubmit = React.useCallback(
    (data: any) => {
      mutateCreateUser({
        ...data,
        is_active: data.is_active === 'true' ? true : false,
        divisi_id: Number(data.divisi_id),
      });
    },
    [mutateCreateUser],
  );
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
            <DialogTitle>Tambah User</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(() => onSubmit(form.getValues()))}
              className='space-y-3'
            >
              <FormField
                control={form.control}
                name='full_name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Pengguna</FormLabel>
                    <FormControl>
                      <Input placeholder='Masukkan Nama' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder='Masukkan Username' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        placeholder='Masukkan Password'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='role'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Pilih Role' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ERole.enumValues.map((item, index) => {
                          return (
                            <SelectItem value={item} key={index}>
                              {item}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='is_active'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value as any}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Pilih Status' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='true'>Aktif</SelectItem>
                        <SelectItem value='false'>Tidak Aktif</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='divisi_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Divisi</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Pilih Divisi' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {dataDivisi?.map((divisi, index) => {
                          return (
                            <SelectItem
                              value={divisi.id?.toString()}
                              key={index}
                            >
                              {divisi.nama}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
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
