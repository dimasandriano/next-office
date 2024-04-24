import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
export default function useVerifyJwt(request: NextRequest) {
  const token = request.headers.get('Authorization')?.split(' ')[1] as string;
  try {
    jwt.verify(token, process.env.JWT_SECRET as string);
    return true;
  } catch {
    return false;
  }
}
