'use client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { format } from 'date-fns';
import { CalendarIcon, ChevronsUpDown } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { toastError } from '@/lib/sonner/toast-error.sonner';
import queryClient from '@/lib/tanstack';
import { cn } from '@/lib/utils';

import { DeleteModal } from '@/components/modal/delete.modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';

import { disposisiService } from '@/services/disposisi.service';
import { divisiService } from '@/services/divisi.service';

import { AxiosResError } from '@/types/axios-res-error.type';
import { TSchemaDisposisi } from '@/types/disposisi.type';
import { TSchemaDivisi } from '@/types/divisi.type';
import { TSchemaLamaran } from '@/types/lamaran.type';
import { TSchemaSurat } from '@/types/surat.type';

type TProps = {
  lamaran?: TSchemaLamaran;
  surat?: TSchemaSurat;
};

export function DisposisiSheet({ lamaran, surat }: TProps) {
  const [open, setOpen] = useState(false);
  const [openSelect, setOpenSelect] = useState(false);
  const isCreateLamaran = useMemo(() => !lamaran?.disposisi, [lamaran]);
  const isCreateSurat = useMemo(() => !surat?.disposisi, [surat]);

  const form = useForm({
    mode: 'onChange',
  });
  const { handleSubmit, reset, getValues, setValue } = form;

  const { mutate: mutateCreateDisposisi, isPending: isPendingCreateDisposisi } =
    useMutation({
      mutationKey: ['create-disposisi'],
      mutationFn: (data: Partial<TSchemaDisposisi>) =>
        disposisiService.createDisposisi(data),
      onSuccess: () => {
        toast.success('Berhasil Disposisi');
        reset();
        queryClient.invalidateQueries({ queryKey: ['lamaran'] });
        queryClient.invalidateQueries({ queryKey: ['surat'] });
        setOpen(false);
      },
      onError: (error: AxiosError<AxiosResError>) =>
        toastError('Gagal Membuat Disposisi', error),
    });
  const { mutate: mutateUpdateDisposisi, isPending: isPendingUpdateDisposisi } =
    useMutation({
      mutationKey: ['update-disposisi'],
      mutationFn: (data: Partial<TSchemaDisposisi>) =>
        disposisiService.updateDisposisi(data),
      onSuccess: () => {
        toast.success('Berhasil Update Disposisi');
        reset();
        queryClient.invalidateQueries({ queryKey: ['lamaran'] });
        queryClient.invalidateQueries({ queryKey: ['surat'] });
        setOpen(false);
      },
      onError: (error: AxiosError<AxiosResError>) =>
        toastError('Gagal Update Disposisi', error),
    });

  const onSubmit = useCallback(() => {
    if (lamaran) {
      if (isCreateLamaran) {
        mutateCreateDisposisi({
          ...getValues(),
          divisi_id: getValues().divisi_id && Number(getValues().divisi_id),
          lamaran_id: lamaran && lamaran?.id,
          surat_id: surat && surat?.id,
          tgl_diterima: getValues().tgl_diterima && getValues().tgl_diterima,
        });
        return;
      } else {
        mutateUpdateDisposisi({
          ...getValues(),
          id: lamaran?.disposisi?.id,
          divisi_id: getValues().divisi_id && Number(getValues().divisi_id),
          lamaran_id: lamaran && lamaran?.id,
          surat_id: surat && surat?.id,
          tgl_diterima: getValues().tgl_diterima && getValues().tgl_diterima,
        });
      }
    }
    if (surat) {
      if (isCreateSurat) {
        mutateCreateDisposisi({
          ...getValues(),
          divisi_id: getValues().divisi_id && Number(getValues().divisi_id),
          lamaran_id: lamaran && lamaran?.id,
          surat_id: surat && surat?.id,
          tgl_diterima: getValues().tgl_diterima && getValues().tgl_diterima,
        });
        return;
      } else {
        mutateUpdateDisposisi({
          ...getValues(),
          id: surat?.disposisi?.id,
          divisi_id: getValues().divisi_id && Number(getValues().divisi_id),
          lamaran_id: lamaran && lamaran?.id,
          surat_id: surat && surat?.id,
          tgl_diterima: getValues().tgl_diterima && getValues().tgl_diterima,
        });
      }
    }
  }, [
    getValues,
    isCreateLamaran,
    isCreateSurat,
    lamaran,
    mutateCreateDisposisi,
    mutateUpdateDisposisi,
    surat,
  ]);

  const { data: dataDivisi } = useQuery<TSchemaDivisi[]>({
    queryKey: ['divisi'],
    queryFn: () =>
      divisiService.getAllDivisiSelection({
        take: 100,
      }),
    enabled: open,
  });
  useEffect(() => {
    if (!isCreateLamaran || !isCreateSurat) {
      if (lamaran) {
        setValue('id', lamaran?.disposisi?.id);
        setValue('divisi_id', lamaran?.disposisi?.divisi_id?.toString());
        setValue('tgl_diterima', lamaran?.disposisi?.tgl_diterima);
        setValue('isi', lamaran?.disposisi?.isi);
        setValue('note_pengirim', lamaran?.disposisi?.note_pengirim);
        setValue('note_penerima', lamaran?.disposisi?.note_penerima);
      }
      if (surat) {
        setValue('id', surat?.disposisi?.id);
        setValue('divisi_id', surat?.disposisi?.divisi_id?.toString());
        setValue('tgl_diterima', surat?.disposisi?.tgl_diterima);
        setValue('isi', surat?.disposisi?.isi);
        setValue('note_pengirim', surat?.disposisi?.note_pengirim);
        setValue('note_penerima', surat?.disposisi?.note_penerima);
      }
    }
  }, [isCreateLamaran, isCreateSurat, lamaran, setValue, surat]);

  const selectionDivisi = useMemo(() => {
    return dataDivisi?.map((item) => {
      return {
        value: item.id.toString(),
        label: item.nama,
      };
    });
  }, [dataDivisi]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        asChild
        aria-controls={undefined}
        aria-haspopup={undefined}
        aria-expanded={undefined}
      >
        <div>
          {surat && (
            <Button variant={surat?.disposisi ? 'default' : 'secondary'}>
              {surat?.disposisi ? 'Terdisposisi' : 'Disposisikan'}
            </Button>
          )}
          {lamaran && (
            <Badge
              variant={lamaran?.disposisi ? 'default' : 'secondary'}
              className='cursor-pointer'
            >
              {lamaran?.disposisi ? 'Terdisposisi' : 'Disposisikan'}
            </Badge>
          )}
        </div>
      </SheetTrigger>
      <SheetContent className='min-w-[50%]'>
        <SheetHeader>
          <SheetTitle>
            {!isCreateLamaran || !isCreateSurat ? 'Edit ' : ''}Disposisi{' '}
            {lamaran && 'Lamaran'}
            {surat && 'Surat'} Dari {lamaran && lamaran?.pelamar}
            {surat && surat?.no_surat}
          </SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className='mt-3 space-y-3'>
            <FormField
              control={form.control}
              name='tgl_diterima'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Tanggal Diterima</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant='outline'
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'EEEE, dd MMMM yyyy')
                          ) : (
                            <span>Pilih Tanggal Diterima</span>
                          )}
                          <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar
                        mode='single'
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='divisi_id'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel>Divisi</FormLabel>
                  <Popover open={openSelect} onOpenChange={setOpenSelect}>
                    <PopoverTrigger asChild>
                      <Button
                        variant='outline'
                        className='w-full justify-between font-normal'
                      >
                        {field.value
                          ? selectionDivisi?.find(
                              (divisi) => divisi.value === field.value,
                            )?.label
                          : 'Pilih Divisi'}
                        <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className='w-[calc(50vw-3rem)] p-0'
                      align='start'
                    >
                      <Command>
                        <CommandInput placeholder='Cari divisi...' />
                        <CommandList>
                          <CommandEmpty>Divisi tidak ditemukan</CommandEmpty>
                          <CommandGroup>
                            {selectionDivisi?.map((divisi) => (
                              <CommandItem
                                key={divisi.value}
                                value={divisi.label}
                                onSelect={() => {
                                  form.setValue('divisi_id', divisi.value);
                                  setOpenSelect(false);
                                }}
                              >
                                {divisi.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='isi'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Isi Disposisi</FormLabel>
                  <FormControl>
                    <Textarea placeholder='Masukkan isi disposisi' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='note_pengirim'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catatan Pengirim</FormLabel>
                  <FormControl>
                    <Textarea placeholder='Masukkan Catatan' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='note_penerima'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catatan Penerima</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Masukkan Catatan'
                      disabled
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex items-center justify-between'>
              <DeleteModal
                disposisi={
                  lamaran
                    ? lamaran.disposisi
                    : surat
                      ? surat.disposisi
                      : undefined
                }
                isDisposisi
                setOpen={setOpen}
              />
              <Button
                type='submit'
                disabled={isPendingCreateDisposisi || isPendingUpdateDisposisi}
              >
                {lamaran
                  ? isCreateLamaran
                    ? 'Disposisikan'
                    : 'Update Disposisi'
                  : ''}
                {surat
                  ? isCreateSurat
                    ? 'Disposisikan'
                    : 'Update Disposisi'
                  : ''}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
