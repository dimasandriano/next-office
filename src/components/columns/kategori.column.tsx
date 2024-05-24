import { ColumnDef } from '@tanstack/react-table';
import React from 'react';

import { generateSize } from '@/lib/tanstack/column';

import { DeleteModal } from '@/components/modal/delete.modal';
import { EditModal } from '@/components/modal/edit.modal';

import { TSchemaKategori } from '@/types/kategori.type';

export default function useKategoriColumn(widthTableContainer: number) {
  return React.useMemo<ColumnDef<TSchemaKategori>[]>(() => {
    const cols: ColumnDef<TSchemaKategori>[] = [
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
        id: 'kategori',
        header: 'Kategori',
        meta: {
          sizeScale: 4,
        },
        cell: ({ row }) => {
          return row.original.nama;
        },
      },
      {
        id: 'keterangan',
        header: 'Keterangan',
        meta: {
          sizeScale: 4,
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
                <EditModal kategori={row.original} />
                <DeleteModal kategori={row.original} />
              </div>
            </div>
          );
        },
      },
    ];
    return generateSize(cols, widthTableContainer);
  }, [widthTableContainer]);
}
