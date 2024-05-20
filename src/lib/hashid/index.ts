import Hashids from 'hashids';

export const hashid = new Hashids(
  'next-office',
  10,
  'abcdefghijklmnopqrstuvwxyz1234567890',
);
