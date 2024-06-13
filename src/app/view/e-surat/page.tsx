'use client';
import { useInfiniteQuery } from '@tanstack/react-query';
import * as React from 'react';
import { useElementSize } from 'usehooks-ts';

import getNextPageParam from '@/hooks/getNextPageParam';

import useViewLamaranColumn from '@/components/columns/view-lamaran.column';
import useViewSuratColumn from '@/components/columns/view-surat.column';
import LogoutModal from '@/components/modal/logout.modal';
import { TableVirtualized } from '@/components/molecules/TableVirtualized';
import Tabs from '@/components/ui/tabs';

import { disposisiService } from '@/services/disposisi.service';

import { TSchemaDisposisi } from '@/types/disposisi.type';

export default function Page() {
  const [tableContainerRef, { width: widthTableContainer }] = useElementSize();
  const tabs = ['Surat', 'Lamaran'];
  const columnSurat = useViewSuratColumn(widthTableContainer || 0);
  const columnLamaran = useViewLamaranColumn(widthTableContainer || 0);
  const [selectedTab, setSelectedTab] = React.useState<string>(tabs[0]);

  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['disposisi'],
      queryFn: async ({ pageParam = 1 }) =>
        await disposisiService.getAllDisposisiUser({ page: pageParam }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => getNextPageParam(lastPage),
    });
  const dataDisposisi: TSchemaDisposisi[] = React.useMemo(() => {
    return data?.pages.flatMap((page) => page.data || []) || [];
  }, [data?.pages]);

  const dataLamaran = React.useMemo(() => {
    return dataDisposisi?.filter((data) => data.lamaran !== null);
  }, [dataDisposisi]);

  const dataSurat = React.useMemo(() => {
    return dataDisposisi?.filter((data) => data.surat !== null);
  }, [dataDisposisi]);

  return (
    <div>
      <h1 className='bg-gradient-to-r from-primary to-primary-foreground bg-clip-text pb-6 pt-4 text-center text-5xl font-bold text-transparent'>
        Surat & Lamaran Disposisi
      </h1>
      <div className='space-y-3'>
        <div className='flex flex-wrap items-center gap-2'>
          {tabs.map((tab) => (
            <Tabs
              text={tab}
              selected={selectedTab === tab}
              setSelected={setSelectedTab}
              key={tab}
            />
          ))}
        </div>
        {selectedTab === 'Surat' ? (
          <div ref={tableContainerRef}>
            <TableVirtualized
              data={dataSurat}
              columns={columnSurat}
              loading={isLoading}
              className='max-h-[calc(100vh-300px)] min-h-[calc(100vh-300px)]'
              infiniteScroll={{
                fetchNextPage,
                hasNextPage,
                isFetchingNextPage,
              }}
            />
          </div>
        ) : (
          <div ref={tableContainerRef}>
            <TableVirtualized
              data={dataLamaran}
              columns={columnLamaran}
              loading={isLoading}
              className='max-h-[calc(100vh-300px)] min-h-[calc(100vh-300px)]'
              infiniteScroll={{
                fetchNextPage,
                hasNextPage,
                isFetchingNextPage,
              }}
            />
          </div>
        )}
        <LogoutModal />
      </div>
    </div>
  );
}
