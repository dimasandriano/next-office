import { NextResponse } from 'next/server';

export const UnauthorizedError = () => {
  return NextResponse.json(
    { status: 'error', error: 'Unauthorized' },
    {
      status: 401,
    },
  );
};
