import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export const UnauthorizedError = () => {
  return NextResponse.json(
    { status: 'error', error: 'Unauthorized' },
    {
      status: 401,
    },
  );
};

export const ForbiddenError = () => {
  return NextResponse.json(
    { status: 'error', error: 'Forbidden' },
    {
      status: 403,
    },
  );
};

export const NotFoundError = (error: string) => {
  return NextResponse.json(
    { status: 'error', error: error },
    {
      status: 404,
    },
  );
};

export const InternalServerError = () => {
  return NextResponse.json(
    { status: 'error', error: 'Internal Server Error' },
    {
      status: 500,
    },
  );
};

export const BadRequestError = (error: ZodError | string) => {
  return NextResponse.json(
    { status: 'error', error: error },
    {
      status: 400,
    },
  );
};
