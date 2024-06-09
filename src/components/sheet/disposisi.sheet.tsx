'use client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import queryClient from '@/lib/tanstack';
import { cn } from '@/lib/utils';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

import { TSchemaDisposisi } from '@/types/disposisi.type';
import { TSchemaDivisi } from '@/types/divisi.type';
import { TSchemaLamaran } from '@/types/lamaran.type';

type TProps = {
  lamaran?: TSchemaLamaran;
};

export function DisposisiSheet({ lamaran }: TProps) {
  const isCreate = useMemo(() => !lamaran?.disposisi, [lamaran]);
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
      },
      onError: () => {
        toast.error('Gagal Disposisi');
      },
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
      },
      onError: () => {
        toast.error('Gagal Update Disposisi');
      },
    });

  const onSubmit = useCallback(() => {
    if (isCreate) {
      mutateCreateDisposisi({
        ...getValues(),
        divisi_id: Number(getValues().divisi_id),
        lamaran_id: lamaran && lamaran?.id,
      });
      return;
    } else {
      mutateUpdateDisposisi({
        ...getValues(),
        divisi_id: Number(getValues().divisi_id),
        lamaran_id: lamaran && lamaran?.id,
      });
    }
  }, [
    getValues,
    isCreate,
    lamaran,
    mutateCreateDisposisi,
    mutateUpdateDisposisi,
  ]);

  const { data: dataDivisi } = useQuery<TSchemaDivisi[]>({
    queryKey: ['divisi'],
    queryFn: () => divisiService.getAllDivisiSelection(),
  });

  useEffect(() => {
    if (!isCreate && lamaran) {
      setValue('id', lamaran?.disposisi?.id);
      setValue('divisi_id', lamaran?.disposisi?.divisi_id?.toString());
      setValue('tgl_diterima', lamaran?.disposisi?.tgl_diterima);
      setValue('isi', lamaran?.disposisi?.isi);
      setValue('note_pengirim', lamaran?.disposisi?.note_pengirim);
    }
  }, [isCreate, lamaran, setValue]);
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Badge
          variant={lamaran?.disposisi ? 'default' : 'secondary'}
          className='cursor-pointer'
        >
          {lamaran?.disposisi ? 'Terdisposisi' : 'Disposisikan'}
        </Badge>
      </SheetTrigger>
      <SheetContent className='min-w-[50%]'>
        <SheetHeader>
          <SheetTitle>
            {!isCreate ? 'Edit ' : ''}Disposisi Lamaran Dari {lamaran?.pelamar}
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
                <FormItem>
                  <FormLabel>Divisi</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Pilih Divisi' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {dataDivisi?.map((divisi, index) => {
                        return (
                          <SelectItem value={divisi.id?.toString()} key={index}>
                            {divisi.nama}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
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
            <div className='flex justify-end'>
              <Button
                type='submit'
                disabled={isPendingCreateDisposisi || isPendingUpdateDisposisi}
              >
                {isCreate ? 'Disposisikan' : 'Update Disposisi'}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
