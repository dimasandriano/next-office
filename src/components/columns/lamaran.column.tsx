import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { id } from 'date-fns/locale/id';
import { Eye, PenBox } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { hashid } from '@/lib/hashid';
import { generateSize } from '@/lib/tanstack/column';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { TSchemaLamaran } from '@/types/lamaran.type';

export default function useLamaranColumn(widthTableContainer: number) {
  return React.useMemo<ColumnDef<TSchemaLamaran>[]>(() => {
    const cols: ColumnDef<TSchemaLamaran>[] = [
      {
        id: 'no',
        header: 'No',
        meta: {
          sizeScale: 1,
        },
        cell: ({ row }) => {
          return Number(row.id) + 1;
        },
      },
      {
        id: 'pelamar',
        header: 'Nama Pelamar',
        meta: {
          sizeScale: 4,
        },
        cell: ({ row }) => {
          return row.original.pelamar;
        },
      },
      {
        id: 'tgl',
        header: 'Tanggal',
        meta: {
          sizeScale: 4,
        },
        cell: ({ row }) => {
          return format(row.original.tgl, 'dd MMM yyyy HH:mm', {
            locale: id,
          });
        },
      },
      {
        id: 'ttl',
        header: 'TTL',
        meta: {
          sizeScale: 4,
        },
        cell: ({ row }) => {
          return row.original.ttl;
        },
      },
      {
        id: 'no_hp',
        header: 'No HP',
        meta: {
          sizeScale: 4,
        },
        cell: ({ row }) => {
          return row.original.no_hp;
        },
      },
      {
        id: 'status',
        header: 'Status Surat',
        meta: {
          sizeScale: 4,
        },
        cell: ({ row }) => {
          return (
            <Badge variant={row.original.status}>
              {row.original.status?.split('_').join(' ')}
            </Badge>
          );
        },
      },

      {
        id: 'aksi',
        header: 'Aksi',
        meta: {
          sizeScale: 4,
        },
        cell: ({ row }) => {
          return (
            <div>
              <div className='flex gap-2'>
                <Button size='icon' variant='outline' asChild>
                  <Link
                    href={'/e-surat/surat/' + hashid.encode(row.original.id)}
                  >
                    <Eye />
                  </Link>
                </Button>
                <Button size='icon' variant='default'>
                  <PenBox />
                </Button>
                {/* <DeleteModal surat={row.original} /> */}
              </div>
            </div>
          );
        },
      },
    ];
    return generateSize(cols, widthTableContainer);
  }, [widthTableContainer]);
}
