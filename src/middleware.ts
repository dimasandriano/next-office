import { NextRequest, NextResponse } from 'next/server';

import useDecodedTokenJWT from '@/hooks/useDecodedTokenJWT';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  const { role } = useDecodedTokenJWT(request);

  if (role === 'user' && request.nextUrl.pathname.startsWith('/e-surat')) {
    return NextResponse.redirect(new URL('/view/e-surat', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/e-surat/:path*', '/view/:path*'],
};
