import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { id } from 'date-fns/locale/id';
import React from 'react';

import { generateSize } from '@/lib/tanstack/column';

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
          return row.original.tipe;
        },
      },
      {
        id: 'sifat_surat',
        header: 'Sifat Surat',
        meta: {
          sizeScale: 4,
        },
      },
      {
        id: 'nomor surat',
        header: 'No Surat',
        meta: {
          sizeScale: 4,
        },
      },
    ];
    return generateSize(cols, widthTableContainer);
  }, [widthTableContainer]);
}
