import {
  LayoutDashboard,
  Mail,
  ScrollText,
  Split,
  SquareStack,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import LogoutModal from '@/components/modal/logout.modal';
import { Button } from '@/components/ui/button';

export default function Sidebar() {
  return (
    <div className='h-screen w-full space-y-5 p-3'>
      <div className='pb-2 text-center'>LOGO</div>
      <div className='flex h-[calc(100vh-75px)] flex-col justify-between'>
        <div className='flex flex-col justify-start gap-5'>
          <Button variant='outline' asChild isSidebar>
            <Link href='/e-surat' className='flex items-center gap-3'>
              <LayoutDashboard />
              Dashboard
            </Link>
          </Button>
          <Button variant='outline' asChild isSidebar>
            <Link href='/e-surat/surat' className='flex items-center gap-3'>
              <Mail />
              Kelola Surat
            </Link>
          </Button>
          <Button variant='outline' asChild isSidebar>
            <Link href='/e-surat/lamaran' className='flex items-center gap-3'>
              <ScrollText />
              Kelola Lamaran
            </Link>
          </Button>
          <Button variant='outline' asChild isSidebar>
            <Link href='/e-surat/kategori' className='flex items-center gap-3'>
              <SquareStack />
              Kelola Kategori
            </Link>
          </Button>
          <Button variant='outline' asChild isSidebar>
            <Link href='/e-surat/divisi' className='flex items-center gap-3'>
              <Split />
              Kelola Divisi
            </Link>
          </Button>
          <Button variant='outline' asChild isSidebar>
            <Link href='/e-surat/users' className='flex items-center gap-3'>
              <Users />
              Kelola Pengguna
            </Link>
          </Button>
        </div>
        <LogoutModal />
      </div>
    </div>
  );
}
