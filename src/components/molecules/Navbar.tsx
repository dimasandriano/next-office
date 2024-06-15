'use client';

import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';

import { useDecodedTokenJWTClient } from '@/hooks/useDecodedTokenJWT';

import DarkModeToggle from '@/components/molecules/DarkModeToggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { TSchemaUsers } from '@/types/users.type';

export default function Navbar() {
  const pathname = usePathname();
  const [decoded, setDecoded] = React.useState<Partial<TSchemaUsers>>();
  useEffect(() => {
    const decodeToken = useDecodedTokenJWTClient();
    setDecoded(decodeToken);
  }, []);
  return (
    <div className='flex w-full items-center justify-between border-b-2 px-5 py-3'>
      {pathname.startsWith('/e-surat') ? (
        <div></div>
      ) : (
        <div className='text-2xl font-bold'>E-SURAT</div>
      )}
      <div className='flex items-center gap-3'>
        <Avatar>
          <AvatarImage src='https://github.com/shadcn.png' alt='avatar' />
          <AvatarFallback>user</AvatarFallback>
        </Avatar>
        <div className='flex flex-col'>
          <h5 className='leading-none'>{decoded?.username}</h5>
          <h5 className='leading-none'>{decoded?.role}</h5>
        </div>
        <DarkModeToggle />
      </div>
    </div>
  );
}
