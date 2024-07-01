'use client';
import {
  LayoutDashboard,
  Mail,
  ScrollText,
  Split,
  SquareStack,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

import { useDecodedTokenJWTClient } from '@/hooks/useDecodedTokenJWT';

import LogoutModal from '@/components/modal/logout.modal';
import { Button } from '@/components/ui/button';

export default function Sidebar() {
  const pathname = usePathname();
  const decoded = useDecodedTokenJWTClient();
  return (
    <div className='h-screen w-full space-y-5 p-3'>
      <div className='text-center text-2xl font-bold'>E-SURAT</div>
      <div className='flex h-[calc(100vh-75px)] flex-col justify-between'>
        <div className='flex flex-col justify-start gap-5'>
          <Button
            variant={pathname === '/e-surat' ? 'default' : 'outline'}
            asChild
            isSidebar
          >
            <Link href='/e-surat' className='flex items-center gap-3'>
              <LayoutDashboard />
              Dashboard
            </Link>
          </Button>
          <Button
            variant={pathname === '/e-surat/surat' ? 'default' : 'outline'}
            asChild
            isSidebar
          >
            <Link href='/e-surat/surat' className='flex items-center gap-3'>
              <Mail />
              Kelola Surat
            </Link>
          </Button>
          <Button
            variant={pathname === '/e-surat/lamaran' ? 'default' : 'outline'}
            asChild
            isSidebar
          >
            <Link href='/e-surat/lamaran' className='flex items-center gap-3'>
              <ScrollText />
              Kelola Lamaran
            </Link>
          </Button>
          <Button
            variant={pathname === '/e-surat/kategori' ? 'default' : 'outline'}
            asChild
            isSidebar
          >
            <Link href='/e-surat/kategori' className='flex items-center gap-3'>
              <SquareStack />
              Kelola Kategori
            </Link>
          </Button>
          <Button
            variant={pathname === '/e-surat/divisi' ? 'default' : 'outline'}
            asChild
            isSidebar
          >
            <Link href='/e-surat/divisi' className='flex items-center gap-3'>
              <Split />
              Kelola Divisi
            </Link>
          </Button>
          {decoded?.role === 'superadmin' && (
            <Button
              variant={pathname === '/e-surat/users' ? 'default' : 'outline'}
              asChild
              isSidebar
            >
              <Link href='/e-surat/users' className='flex items-center gap-3'>
                <Users />
                Kelola Pengguna
              </Link>
            </Button>
          )}
        </div>
        <LogoutModal />
      </div>
    </div>
  );
}
