'use client';
import Cookies from 'js-cookie';
import { redirect } from 'next/navigation';

export default function Layout({ children }: { children: React.ReactNode }) {
  const token = Cookies.get('token');
  if (token) return redirect('/e-surat');
  return <>{children}</>;
}
