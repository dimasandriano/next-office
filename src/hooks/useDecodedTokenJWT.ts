import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';

import { TSchemaUsers } from '@/types/users.type';

export default function useDecodedTokenJWT() {
  const token = Cookies.get('token') || ' ';
  try {
    const decoded = jwt.decode(token) as TSchemaUsers;
    return {
      id: decoded?.id,
      role: decoded?.role,
      username: decoded?.username,
      divisi_id: decoded?.divisi_id,
    };
  } catch {
    return null;
  }
}
