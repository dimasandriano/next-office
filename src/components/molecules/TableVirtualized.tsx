'use client';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { LoaderCircle } from 'lucide-react';
import React from 'react';

import { cn } from '@/lib/utils';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading?: boolean;
  infiniteScroll?: {
    fetchNextPage: () => void;
    hasNextPage?: boolean;
    isFetchingNextPage: boolean;
  };
  heightTable?: string;
  onRowClick?: (row: TData) => void;
  className?: string;
  classNameBody?: string;
  classNameHeader?: string;
}

export function TableVirtualized<TData, TValue>({
  columns = [],
  data = [],
  loading = true,
  infiniteScroll,
  onRowClick,
  className,
  classNameHeader,
  classNameBody,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    defaultColumn: {
      minSize: 1,
      size: 0,
    },
  });
  const parentRef = React.useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: data?.length && table ? table.getRowModel().rows.length : 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 77,
  });
  const tableHeaderRef = React.useRef(null);
  const tbodyRef = React.useRef<HTMLTableSectionElement>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const headersRef = React.useRef<any[]>([]);

  const handleScroll: React.UIEventHandler<HTMLDivElement> = React.useCallback(
    (event) => {
      const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
      const scrollThreshold = 100;
      if (
        scrollHeight - scrollTop <= clientHeight + scrollThreshold &&
        infiniteScroll?.hasNextPage &&
        !infiniteScroll?.isFetchingNextPage
      ) {
        infiniteScroll && infiniteScroll?.fetchNextPage();
      }
    },
    [infiniteScroll],
  );
  return (
    <div
      className={cn(
        `block max-h-[55vh] w-full overflow-x-hidden overflow-y-scroll bg-background`,
        'rounded-lg border-2 ',
        className,
      )}
      ref={parentRef}
      onScroll={handleScroll}
    >
      <Table>
        <TableHeader ref={tableHeaderRef} className={classNameHeader}>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className='sticky top-0 z-10 bg-background'
            >
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    ref={(ref) => {
                      if (
                        headersRef.current.length ===
                        table.getFlatHeaders().reduce((prev) => prev + 1, 0)
                      )
                        headersRef.current = [];
                      headersRef.current.push(ref as never);
                    }}
                    style={{
                      width:
                        header.getSize() !== 0 ? header.getSize() : undefined,
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            position: 'relative',
          }}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ref={tbodyRef as any}
          className='overflow-hidden'
        >
          {loading ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className='h-24 w-full text-center'
              >
                <div className='flex h-full w-full items-center justify-center'>
                  <LoaderCircle className='h-10 w-10 animate-spin' />
                </div>
              </TableCell>
            </TableRow>
          ) : data?.length && table.getRowModel().rows?.length ? (
            virtualizer.getVirtualItems().map((virtualRow) => {
              const row = table.getRowModel().rows[virtualRow.index];
              return (
                <TableRow
                  key={`virtualized-row-${virtualRow.key}`}
                  data-state={row.getIsSelected() && 'selected'}
                  ref={virtualizer.measureElement}
                  data-index={virtualRow.index}
                  className={`${
                    onRowClick ? '' : classNameBody ? classNameBody : ''
                  }`}
                  onClick={() => onRowClick && onRowClick(row.original)}
                  style={{
                    transform: `translateY(${virtualRow.start}px)`,
                    position: 'absolute',
                    display: 'flex',
                    width: tbodyRef?.current?.offsetWidth ?? 0,
                    alignItems: 'center',
                  }}
                >
                  {row.getVisibleCells().map((cell, cellIndex) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        width: table
                          .getHeaderGroups()[0]
                          .headers[cellIndex].getSize(),
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          ) : (
            <TableRow className='w-full'>
              <TableCell colSpan={100} className='h-24 text-center'>
                Tidak Ada Data
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
