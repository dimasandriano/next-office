import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { id } from 'date-fns/locale/id';
import React from 'react';

import { generateSize } from '@/lib/tanstack/column';

import { DisposisiViewSheet } from '@/components/sheet/disposisi-view.sheet';
import SuratDetailSheet from '@/components/sheet/surat-detail.sheet';
import { Badge } from '@/components/ui/badge';

import { TSchemaDisposisi } from '@/types/disposisi.type';
import { TSchemaSurat } from '@/types/surat.type';

export default function useViewSuratColumn(widthTableContainer: number) {
  return React.useMemo<ColumnDef<TSchemaDisposisi>[]>(() => {
    const cols: ColumnDef<TSchemaDisposisi>[] = [
      {
        id: 'no',
        header: 'No',
        meta: {
          sizeScale: 1,
        },
        cell: ({ row }) => {
          return Number(row?.id || 0) + 1;
        },
      },
      {
        id: 'nomor_surat',
        header: 'No Surat',
        meta: {
          sizeScale: 4,
        },
        cell: ({ row }) => {
          return row.original?.surat?.no_surat;
        },
      },
      {
        id: 'tgl_masuk',
        header: 'Tanggal Masuk',
        meta: {
          sizeScale: 4,
        },
        cell: ({ row }) => {
          return format(
            row.original?.surat?.tgl_masuk || new Date(),
            'dd MMM yyyy HH:mm',
            {
              locale: id,
            },
          );
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
              {row.original?.surat?.tipe?.split('_').join(' ')}
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
          return format(
            row.original?.surat?.tgl_kegiatan || new Date(),
            'dd MMM yyyy HH:mm',
            {
              locale: id,
            },
          );
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
            <Badge variant={row.original?.surat?.status}>
              {row.original?.surat?.status?.split('_').join(' ')}
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
            <Badge variant={row.original?.surat?.sifat}>
              {row.original?.surat?.sifat}
            </Badge>
          );
        },
      },
      {
        id: 'disposisi',
        header: 'Disposisi',
        meta: {
          sizeScale: 3,
        },
        cell: ({ row }) => {
          return <DisposisiViewSheet disposisi={row.original} type='surat' />;
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
            <SuratDetailSheet
              data={row.original.surat as TSchemaSurat}
              hiddenDisposisi
            />
          );
        },
      },
    ];
    return generateSize(cols, widthTableContainer);
  }, [widthTableContainer]);
}
