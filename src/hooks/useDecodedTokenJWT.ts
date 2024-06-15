/* eslint-disable @typescript-eslint/no-explicit-any */
import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

import { TSchemaUsers } from '@/types/users.type';

export default function useDecodedTokenJWT(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  const decoded = jwt.decode(token as any) as TSchemaUsers;

  return {
    id: decoded?.id,
    role: decoded?.role,
    username: decoded?.username,
    divisi_id: decoded?.divisi_id,
  };
}

export function useDecodedTokenJWTClient() {
  const token = Cookies.get('token') || ' ';
  const decoded = jwt.decode(token as any) as TSchemaUsers;
  return {
    id: decoded?.id,
    role: decoded?.role,
    username: decoded?.username,
    divisi_id: decoded?.divisi_id,
  };
}
