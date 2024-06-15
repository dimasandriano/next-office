import React from 'react';

import UserLayout from '@/components/layout/user.layout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <UserLayout>{children}</UserLayout>;
}
