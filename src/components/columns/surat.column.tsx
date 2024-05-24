import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { id } from 'date-fns/locale/id';
import { Eye, PenBox } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { hashid } from '@/lib/hashid';
import { generateSize } from '@/lib/tanstack/column';

import { DeleteModal } from '@/components/modal/delete.modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { TSchemaSurat } from '@/types/surat.type';

export default function useSuratColumn(widthTableContainer: number) {
  return React.useMemo<ColumnDef<TSchemaSurat>[]>(() => {
    const cols: ColumnDef<TSchemaSurat>[] = [
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
        id: 'nomor_surat',
        header: 'No Surat',
        meta: {
          sizeScale: 4,
        },
        cell: ({ row }) => {
          return row.original.no_surat;
        },
      },
      {
        id: 'tgl_masuk',
        header: 'Tanggal Masuk',
        meta: {
          sizeScale: 4,
        },
        cell: ({ row }) => {
          return format(row.original.tgl_masuk, 'dd MMM yyyy HH:mm', {
            locale: id,
          });
        },
      },
      {
        id: 'Tipe Surat',
        header: 'Tipe Surat',
        meta: {
          sizeScale: 4,
        },
        cell: ({ row }) => {
          return (
            <p className='capitalize'>
              {row.original.tipe?.split('_').join(' ')}
            </p>
          );
        },
      },
      {
        id: 'kegiatan',
        header: 'Tanggal Kegiatan',
        meta: {
          sizeScale: 4,
        },
        cell: ({ row }) => {
          return format(row.original.tgl_kegiatan, 'dd MMM yyyy HH:mm', {
            locale: id,
          });
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
        id: 'sifat',
        header: 'Sifat Surat',
        meta: {
          sizeScale: 4,
        },
        cell: ({ row }) => {
          return (
            <Badge variant={row.original.sifat}>{row.original.sifat}</Badge>
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
                <DeleteModal surat={row.original} />
              </div>
            </div>
          );
        },
      },
    ];
    return generateSize(cols, widthTableContainer);
  }, [widthTableContainer]);
}
