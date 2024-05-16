'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import React from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { ZloginSchema } from '@/lib/zod/auth.schemaZod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { authService } from '@/services/auth.service';

import { TLogin } from '@/types/auth.type';

export default function Page() {
  const form = useForm<TLogin>({
    resolver: zodResolver(ZloginSchema),
  });
  const { handleSubmit, control } = form;

  const { mutate } = useMutation({
    mutationKey: ['login'],
    mutationFn: async (data: TLogin) => await authService.authLogin(data),
    onError: () => toast.error('Login failed'),
    onSuccess: ({ data }) => {
      toast.success('Login success');
      Cookies.set('next-office-token', data.token, {
        expires: 1,
      });
    },
  });

  const onSubmit = (data: TLogin) => mutate(data);
  return (
    <div className='flex h-screen w-full items-center justify-center'>
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='w-[500px] space-y-3 rounded-lg border-2 p-5 shadow-sm'
        >
          <FormField
            control={control}
            name='username'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder='Masukkan username' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Masukkan password'
                    {...field}
                    type='password'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit' className='w-full'>
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
