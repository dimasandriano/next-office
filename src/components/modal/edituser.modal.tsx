/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
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

type TUpdateUser = Omit<TSchemaUsers, 'is_active'> & { is_active: string };
export function EditModalUser({ users }: { users: TSchemaUsers }) {
  const form = useForm<TUpdateUser>({
    mode: 'all',
  });
  const { setValue, reset } = form;

  React.useEffect(() => {
    setValue('id', users.id);
    setValue('is_active', users.is_active ? 'true' : 'false');
    setValue('username', users.username);
    setValue('divisi_id', users.divisi_id);
    setValue('role', users.role);
    setValue('full_name', users.full_name);
  }, [reset, setValue, users]);

  const { mutate: updateUser } = useMutation({
    mutationKey: ['update-user'],
    mutationFn: (data: Partial<TSchemaUsers>) => userService.updateUser(data),
    onSuccess: () => {
      toast.success('Edit Pengguna Berhasil');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: () => {
      toast.error('Edit Pengguna Gagal');
    },
  });

  const handleUpdate = React.useCallback(
    (data: TUpdateUser) => {
      updateUser({
        ...data,
        divisi_id: Number(data.divisi_id),
        is_active: data.is_active === 'true' ? true : false,
      });
    },
    [updateUser],
  );
  const { data: dataDivisi } = useQuery<TSchemaDivisi[]>({
    queryKey: ['divisi'],
    queryFn: () => divisiService.getAllDivisiSelection(),
  });
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size='icon' variant='default'>
          <PenBox />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Edit</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(() => handleUpdate(form.getValues()))}
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
                          <SelectItem value={divisi.id?.toString()} key={index}>
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
  );
}
