import React from 'react';

import Navbar from '@/components/molecules/Navbar';
import Sidebar from '@/components/molecules/Sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='grid w-full grid-cols-12'>
      <div className='col-span-2 border-r-2'>
        <Sidebar />
      </div>
      <div className='col-span-10'>
        <Navbar />
        <div className='p-5'>{children}</div>
      </div>
    </div>
  );
}
