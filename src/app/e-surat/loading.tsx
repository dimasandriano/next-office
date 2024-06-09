import { LoaderCircle } from 'lucide-react';
import React from 'react';

export default function Loading() {
  return (
    <div className='flex h-[80vh] w-full items-center justify-center'>
      <LoaderCircle className='h-10 w-10 animate-spin' />
    </div>
  );
}
