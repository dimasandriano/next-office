'use client';
import Cookies from 'js-cookie';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import toast from 'react-hot-toast';

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

export default function LogoutModal() {
  const router = useRouter();
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant='destructive' className='w-full'>
          <div className='flex items-center gap-3'>
            Logout
            <ArrowRight />
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className='mb-5'>
          <DialogTitle>Apakah anda yakin untuk keluar?</DialogTitle>
        </DialogHeader>
        <DialogFooter className='flex justify-between'>
          <DialogClose asChild>
            <Button type='button' variant='secondary' className='flex-1'>
              Tidak
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              type='button'
              variant='destructive'
              className='flex-1'
              onClick={() => {
                Cookies.remove('token');
                toast.success('Logout Berhasil');
                router.replace('/login');
              }}
            >
              Keluar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
