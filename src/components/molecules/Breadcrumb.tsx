import { Slash } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import {
  Breadcrumb as BreadcrumbComponent,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export default function Breadcrumb({
  pages,
}: {
  pages: { label: string; url: string }[];
}) {
  return (
    <BreadcrumbComponent>
      <BreadcrumbList>
        {pages.map((page, index) => (
          <div
            key={index}
            className='flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5'
          >
            <BreadcrumbItem>
              {pages.length === index + 1 ? (
                <BreadcrumbPage>{page.label}</BreadcrumbPage>
              ) : (
                <Link href={page.url}>{page.label}</Link>
              )}
            </BreadcrumbItem>
            {pages.length !== index + 1 && (
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
            )}
          </div>
        ))}
      </BreadcrumbList>
    </BreadcrumbComponent>
  );
}
