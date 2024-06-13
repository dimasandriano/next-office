import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { id } from 'date-fns/locale/id';
import React from 'react';

import { generateSize } from '@/lib/tanstack/column';

import LamaranDetailSheet from '@/components/sheet/lamaran.detail.sheet';
import { Badge } from '@/components/ui/badge';

import { TSchemaDisposisi } from '@/types/disposisi.type';
import { TSchemaLamaran } from '@/types/lamaran.type';

export default function useViewLamaranColumn(widthTableContainer: number) {
  return React.useMemo<ColumnDef<TSchemaDisposisi>[]>(() => {
    const cols: ColumnDef<TSchemaDisposisi>[] = [
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
          return row.original?.lamaran?.pelamar;
        },
      },
      {
        id: 'tgl',
        header: 'Tanggal',
        meta: {
          sizeScale: 4,
        },
        cell: ({ row }) => {
          return format(
            row.original?.lamaran?.tgl || new Date(),
            'dd MMM yyyy HH:mm',
            {
              locale: id,
            },
          );
        },
      },
      {
        id: 'ttl',
        header: 'TTL',
        meta: {
          sizeScale: 4,
        },
        cell: ({ row }) => {
          return row.original?.lamaran?.ttl;
        },
      },
      {
        id: 'no_hp',
        header: 'No HP',
        meta: {
          sizeScale: 4,
        },
        cell: ({ row }) => {
          return row.original?.lamaran?.no_hp;
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
            <Badge variant={row.original?.lamaran?.status}>
              {row.original?.lamaran?.status?.split('_').join(' ')}
            </Badge>
          );
        },
      },
      {
        id: 'aksi',
        header: 'Aksi',
        meta: {
          sizeScale: 1,
        },
        cell: ({ row }) => {
          return (
            <div>
              <div className='flex gap-2'>
                <LamaranDetailSheet
                  data={row.original.lamaran as TSchemaLamaran}
                />
              </div>
            </div>
          );
        },
      },
    ];
    return generateSize(cols, widthTableContainer);
  }, [widthTableContainer]);
}
