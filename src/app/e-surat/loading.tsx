import { LoaderCircle } from 'lucide-react';
import React from 'react';

export default function Loading() {
  return (
    <div className='flex w-full justify-center'>
      <LoaderCircle className='h-10 w-10 animate-spin' />
    </div>
  );
}
