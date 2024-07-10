/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { KeyRound } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { hashid } from '@/lib/hashid';
import { toastError } from '@/lib/sonner/toast-error.sonner';
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
import { PasswordInput } from '@/components/ui/password-input';

import { userService } from '@/services/user.service';

import { AxiosResError } from '@/types/axios-res-error.type';
import { TChangePasswordUser, TSchemaUsers } from '@/types/users.type';
const FormSchema = z
  .object({
    password_old: z.string().min(8, 'Password harus diisi minimal 8 karakter'),
    password_new: z.string().min(8, 'Password harus diisi minimal 8 karakter'),
    password_confirm: z
      .string()
      .min(8, 'Konfirmasi Password harus diisi minimal 8 karakter'),
  })
  .refine((data) => data.password_new === data.password_confirm, {
    message: 'Password baru dan konfirmasi password harus sama',
    path: ['password_confirm'],
  });

export function EditModalPasswordUser({ users }: { users: TSchemaUsers }) {
  const [open, setOpen] = React.useState(false);
  const form = useForm<TChangePasswordUser>({
    mode: 'onSubmit',
    resolver: zodResolver(FormSchema),
  });
  const { handleSubmit, clearErrors } = form;

  const { mutate: updatePasswordUser, isPending } = useMutation({
    mutationKey: ['update-password-user'],
    mutationFn: (data: TChangePasswordUser) =>
      userService.changePasswordUser(data),
    onSuccess: () => {
      toast.success('Edit Password Pengguna Berhasil');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setOpen(false);
    },
    onError: (error: AxiosError<AxiosResError>) =>
      toastError('Gagal Edit Password', error),
  });

  const handleUpdate = React.useCallback(
    (data: TChangePasswordUser) => {
      updatePasswordUser({
        ...data,
        id: hashid.encode(users.id),
      });
    },
    [updatePasswordUser, users.id],
  );

  React.useEffect(() => {
    clearErrors();
  }, [clearErrors, open]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size='icon' variant='secondary'>
          <KeyRound />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Edit Password</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={handleSubmit(() => handleUpdate(form.getValues()))}
            className='space-y-3'
          >
            <FormField
              control={form.control}
              name='password_old'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password Lama</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder='Masukkan Password Lama'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password_new'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password Baru</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder='Masukkan Password Baru'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password_confirm'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password Konfirmasi</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder='Masukkan Password Konfirmasi'
                      {...field}
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
                disabled={isPending}
              >
                Simpan
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
