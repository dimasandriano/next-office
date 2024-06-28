'use client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { toastError } from '@/lib/sonner/toast-error.sonner';
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

import { AxiosResError } from '@/types/axios-res-error.type';
import { TSchemaDisposisi } from '@/types/disposisi.type';
import { TSchemaDivisi } from '@/types/divisi.type';

type TProps = {
  disposisi: TSchemaDisposisi;
  type: 'surat' | 'lamaran';
};

export function DisposisiViewSheet({ disposisi, type }: TProps) {
  const [open, setOpen] = useState(false);
  const form = useForm({
    mode: 'onChange',
  });
  const {
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { isDirty },
  } = form;

  const { mutate: mutateUpdateDisposisi, isPending: isPendingUpdateDisposisi } =
    useMutation({
      mutationKey: ['update-disposisi'],
      mutationFn: (data: Partial<TSchemaDisposisi>) =>
        disposisiService.updateDisposisi(data),
      onSuccess: () => {
        toast.success('Berhasil Update Disposisi');
        reset();
        queryClient.invalidateQueries({ queryKey: ['disposisi'] });
        setOpen(false);
      },
      onError: (error: AxiosError<AxiosResError>) =>
        toastError('Gagal Update Disposisi', error),
    });

  const onSubmit = useCallback(() => {
    mutateUpdateDisposisi({
      id: Number(getValues().id),
      note_penerima: getValues().note_penerima,
      tgl_diterima: getValues().tgl_diterima,
    });
  }, [getValues, mutateUpdateDisposisi]);

  const { data: dataDivisi } = useQuery<TSchemaDivisi[]>({
    queryKey: ['divisi'],
    queryFn: () => divisiService.getAllDivisiSelection(),
  });

  useEffect(() => {
    if (disposisi) {
      setValue('id', disposisi?.id);
      setValue('divisi_id', disposisi?.divisi_id?.toString());
      setValue('tgl_diterima', disposisi?.tgl_diterima);
      setValue('isi', disposisi?.isi);
      setValue('note_pengirim', disposisi?.note_pengirim);
      setValue('note_penerima', disposisi?.note_penerima);
    }
  }, [disposisi, setValue]);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Badge variant='default' className='cursor-pointer'>
          Lihat Disposisi
        </Badge>
      </SheetTrigger>
      <SheetContent className='min-w-[50%]'>
        <SheetHeader>
          <SheetTitle>
            Edit Disposisi {type === 'surat' ? 'Surat ' : 'Lamaran '}
            {type === 'surat'
              ? disposisi?.surat?.no_surat
              : disposisi?.lamaran?.pelamar}
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
                    disabled
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
                    <Textarea
                      placeholder='Masukkan isi disposisi'
                      {...field}
                      disabled
                    />
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
                    <Textarea
                      placeholder='Masukkan Catatan'
                      {...field}
                      disabled
                    />
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
                    <Textarea placeholder='Masukkan Catatan' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex justify-end'>
              <Button
                type='submit'
                disabled={isPendingUpdateDisposisi || !isDirty}
              >
                Update Disposisi
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
