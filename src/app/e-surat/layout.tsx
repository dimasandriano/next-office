import React from 'react';

import AdminLayout from '@/components/layout/admin.layout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
