import React from 'react';

import DarkModeToggle from '@/components/molecules/DarkModeToggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Navbar() {
  return (
    <div className='flex w-full items-center justify-between border-b-2 px-5 py-3'>
      <div></div>
      <div className='flex items-center gap-3'>
        <Avatar>
          <AvatarImage src='https://github.com/shadcn.png' />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <DarkModeToggle />
      </div>
    </div>
  );
}
