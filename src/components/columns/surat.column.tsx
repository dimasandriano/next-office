import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { id } from 'date-fns/locale/id';
import React from 'react';

import { generateSize } from '@/lib/tanstack/column';

import { DeleteModal } from '@/components/modal/delete.modal';
import SifatModal from '@/components/modal/sifat.modal';
import StatusModal from '@/components/modal/status.modal';
import SuratDetailSheet from '@/components/sheet/surat-detail.sheet';
import SuratEditSheet from '@/components/sheet/surat-edit.sheet';
import { Badge } from '@/components/ui/badge';

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
          return (
            <div className='flex'>
              {format(row.original.tgl_kegiatan, 'dd MMM yyyy', {
                locale: id,
              })}{' '}
              {row.original.jam}
            </div>
          );
        },
      },
      {
        id: 'status',
        header: () => (
          <div className='flex items-center gap-2'>
            Status Surat <StatusModal />
          </div>
        ),
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
        header: () => (
          <div className='flex items-center gap-2'>
            Sifat Surat <SifatModal />
          </div>
        ),
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
                <SuratDetailSheet data={row.original} />
                <SuratEditSheet data={row.original} />
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
