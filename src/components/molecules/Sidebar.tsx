import Link from 'next/link';
import React from 'react';

import { Button } from '@/components/ui/button';

export default function Sidebar() {
  return (
    <div className='h-screen w-full space-y-5 p-3'>
      <div className='pb-2 text-center'>LOGO</div>
      <div className='flex flex-col justify-start gap-5'>
        <Button variant='outline' asChild>
          <Link href='/e-surat'>Dashboard</Link>
        </Button>
        <Button variant='outline' asChild>
          <Link href='/e-surat/surat'>Kelola Surat</Link>
        </Button>
        <Button variant='outline'>Home</Button>
        <Button variant='outline'>Home</Button>
        <Button variant='outline'>Home</Button>
      </div>
    </div>
  );
}
