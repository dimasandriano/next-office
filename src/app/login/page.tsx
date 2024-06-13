'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { ZloginSchema } from '@/lib/zod/auth.schemaZod';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { authService } from '@/services/auth.service';

import { TLogin } from '@/types/auth.type';

export default function Page() {
  const router = useRouter();
  const [isShowPassword, setIsShowPassword] = React.useState(false);
  const form = useForm<TLogin>({
    resolver: zodResolver(ZloginSchema),
  });
  const { handleSubmit, control } = form;
  const { mutate, isPending } = useMutation({
    mutationKey: ['login'],
    mutationFn: async (data: TLogin) => await authService.authLogin(data),
    onError: () => toast.error('Login failed'),
    onSuccess: ({ data }) => {
      toast.success('Login success');
      Cookies.set('token', data?.token, {
        expires: 1,
      });
      router.push('/e-surat');
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
          <div>
            <h2 className='text-center text-3xl font-bold'>E-SURAT</h2>
          </div>
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
                    type={isShowPassword ? 'text' : 'password'}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex justify-end'>
            <div className='flex items-center space-x-2'>
              <Checkbox
                id='pw'
                onClick={() => setIsShowPassword(!isShowPassword)}
              />
              <Label
                htmlFor='pw'
                className='cursor-pointer text-sm font-normal'
              >
                Tampilkan Password
              </Label>
            </div>
          </div>
          <Button type='submit' className='w-full' disabled={isPending}>
            {isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            {isPending ? 'Login...' : 'Login'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
