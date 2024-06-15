import React from 'react';

import Navbar from '@/components/molecules/Navbar';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />
      <div className='p-5'>{children}</div>
    </div>
  );
}
