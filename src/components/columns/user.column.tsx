import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { id } from 'date-fns/locale/id';
import React from 'react';

import { generateSize } from '@/lib/tanstack/column';

import { DeleteModal } from '@/components/modal/delete.modal';
import { EditModalPasswordUser } from '@/components/modal/editpassworduser.modal';
import { EditModalUser } from '@/components/modal/edituser.modal';
import { Badge } from '@/components/ui/badge';

import { TSchemaUsers } from '@/types/users.type';

export default function useUserColumn(widthTableContainer: number) {
  return React.useMemo<ColumnDef<TSchemaUsers>[]>(() => {
    const cols: ColumnDef<TSchemaUsers>[] = [
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
        id: 'full_name',
        header: 'Nama Pengguna',
        meta: {
          sizeScale: 4,
        },
        cell: ({ row }) => {
          return row.original.full_name;
        },
      },
      {
        id: 'username',
        header: 'Username',
        meta: {
          sizeScale: 4,
        },
        cell: ({ row }) => {
          return row.original.username;
        },
      },
      {
        id: 'role',
        header: 'Role',
        meta: {
          sizeScale: 4,
        },
        cell: ({ row }) => {
          return row.original.role;
        },
      },
      {
        id: 'is_active',
        header: 'Status',
        meta: {
          sizeScale: 4,
        },
        cell: ({ row }) => {
          return row.original.is_active ? (
            <Badge variant='DONE'>Aktif</Badge>
          ) : (
            <Badge variant='ON_REVIEW'>Tidak Aktif</Badge>
          );
        },
      },
      {
        id: 'divisi',
        header: 'Divisi',
        meta: {
          sizeScale: 4,
        },
        cell: ({ row }) => {
          return row.original.division?.nama || '-';
        },
      },
      {
        id: 'created_by',
        header: 'Dibuat Oleh',
        meta: {
          sizeScale: 4,
        },
        cell: ({ row }) => {
          return row.original.created_by || '-';
        },
      },
      {
        id: 'created_at',
        header: 'Dibuat Pada',
        meta: {
          sizeScale: 4,
        },
        cell: ({ row }) => {
          return row.original.created_at
            ? format(row.original.created_at, 'dd MMM yyyy HH:mm', {
                locale: id,
              })
            : '-';
        },
      },
      {
        id: 'aksi',
        header: 'Aksi',
        meta: {
          sizeScale: 3,
        },
        cell: ({ row }) => {
          return (
            <div>
              <div className='flex gap-2'>
                <EditModalPasswordUser users={row.original} />
                <EditModalUser users={row.original} />
                <DeleteModal users={row.original} />
              </div>
            </div>
          );
        },
      },
    ];
    return generateSize(cols, widthTableContainer);
  }, [widthTableContainer]);
}
