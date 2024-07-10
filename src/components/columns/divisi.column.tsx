import { ColumnDef } from '@tanstack/react-table';
import React from 'react';

import { generateSize } from '@/lib/tanstack/column';

import { DeleteModal } from '@/components/modal/delete.modal';
import { EditModal } from '@/components/modal/edit.modal';

import { TSchemaDivisi } from '@/types/divisi.type';

export default function useDivisiColumn(widthTableContainer: number) {
  return React.useMemo<ColumnDef<TSchemaDivisi>[]>(() => {
    const cols: ColumnDef<TSchemaDivisi>[] = [
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
        id: 'divisi',
        header: 'Divisi',
        meta: {
          sizeScale: 4,
        },
        cell: ({ row }) => {
          return row.original.nama;
        },
      },
      {
        id: 'keterangan_divisi',
        header: 'Keterangan',
        meta: {
          sizeScale: 8,
        },
        cell: ({ row }) => {
          return row.original.keterangan;
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
                <EditModal divisi={row.original} />
                <DeleteModal divisi={row.original} />
              </div>
            </div>
          );
        },
      },
    ];
    return generateSize(cols, widthTableContainer);
  }, [widthTableContainer]);
}
