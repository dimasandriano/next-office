'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { format, isDate } from 'date-fns';
import { CalendarIcon, Plus } from 'lucide-react';
import { useCallback, useState } from 'react';
import { FieldValues, useForm, UseFormReset } from 'react-hook-form';
import toast from 'react-hot-toast';

import queryClient from '@/lib/tanstack';
import { cn } from '@/lib/utils';

import { TimePicker } from '@/components/molecules/TimePicker';
import FileUploaderMultiple from '@/components/molecules/UploadMultiple';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scrol-area';
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
import {
  type StepItem,
  Step,
  Stepper,
  useStepper,
} from '@/components/ui/stepper';
import { Textarea } from '@/components/ui/textarea';

import { ESifat } from '@/enums/sifat.enum';
import { EStatus } from '@/enums/status.enum';
import { ETipe } from '@/enums/tipe.enum';
import { kategoriService } from '@/services/kategori.service';
import { suratService } from '@/services/surat.service';

import { TSchemaKategori } from '@/types/kategori.type';
import { TSchemaSurat } from '@/types/surat.type';

export default function SuratCreateSheet() {
  const [open, setOpen] = useState(false);
  const steps = [
    { label: 'Jenis Surat' },
    { label: 'Detail' },
    { label: 'Isi' },
    { label: 'Dokumen' },
  ] satisfies StepItem[];
  const form = useForm({
    mode: 'all',
  });

  const { watch } = form;
  const { handleSubmit, reset, getValues } = form;
  const [pathFiles, setPathFiles] = useState<string[]>([]);

  const { mutate: mutateCreateSurat, isPending } = useMutation({
    mutationKey: ['create-surat'],
    mutationFn: (data: Partial<TSchemaSurat>) => suratService.createSurat(data),
    onSuccess: () => {
      toast.success('Surat Berhasil Dibuat');
      reset();
      setPathFiles([]);
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ['surat'] });
    },
    onError: () => toast.error('Surat Gagal Dibuat'),
  });
  const onSubmit = useCallback(() => {
    mutateCreateSurat({
      ...getValues(),
      kategori_id: Number(watch('kategori_id')),
      jam: isDate(watch('jam')) ? format(watch('jam'), 'HH:mm') : undefined,
      files: JSON.stringify(pathFiles),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    getValues,
    mutateCreateSurat,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    watch('jam'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    watch('kategori_id'),
    pathFiles,
  ]);

  const { data: dataKategori } = useQuery<TSchemaKategori[]>({
    queryKey: ['kategoris'],
    queryFn: () => kategoriService.getAllKategori(),
    enabled: open,
  });
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <span className='mr-1 text-xl'>
            <Plus />
          </span>
          Tambah Surat
        </Button>
      </SheetTrigger>
      <SheetContent className='min-w-[50%]'>
        <SheetHeader>
          <SheetTitle>Tambah Surat</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='mt-5 flex flex-col justify-between'>
              <div className='flex w-full flex-col gap-4'>
                <ScrollArea className='h-[90dvh] pr-2'>
                  <Stepper initialStep={0} steps={steps}>
                    <Step label={steps[0].label}>
                      <div className='my-4 space-y-3 px-2'>
                        <FormField
                          control={form.control}
                          name='tipe'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Jenis Surat</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  value={field.value || ''}
                                  className='flex flex-col space-y-1'
                                >
                                  {ETipe.enumValues.map((tipe) => {
                                    return (
                                      <FormItem
                                        className='flex items-center space-x-3 space-y-0'
                                        key={tipe}
                                      >
                                        <FormControl>
                                          <RadioGroupItem value={tipe} />
                                        </FormControl>
                                        <FormLabel className='block w-full font-normal uppercase'>
                                          <Card
                                            className={cn(
                                              'cursor-pointer',
                                              watch('tipe') === tipe &&
                                                'ring-2 ring-ring',
                                            )}
                                          >
                                            <CardContent className='flex items-center justify-center p-5 '>
                                              <h3>
                                                {tipe.split('_').join(' ')}
                                              </h3>
                                            </CardContent>
                                          </Card>
                                        </FormLabel>
                                      </FormItem>
                                    );
                                  })}
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </Step>
                    <Step label={steps[1].label}>
                      <div className='my-4 space-y-3 px-2'>
                        <FormField
                          control={form.control}
                          name='no_surat'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>No Surat</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder='Masukkan No Surat'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name='tgl_masuk'
                          render={({ field }) => (
                            <FormItem className='flex flex-col'>
                              <FormLabel className='text-left'>
                                Tanggal Masuk
                              </FormLabel>
                              <Popover>
                                <FormControl>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant='outline'
                                      className={cn(
                                        'w-full justify-start text-left font-normal',
                                        !field.value && 'text-muted-foreground',
                                      )}
                                    >
                                      <CalendarIcon className='mr-2 h-4 w-4' />
                                      {field.value ? (
                                        format(
                                          field.value,
                                          'EEEE, dd MMMM yyyy HH:mm:ss',
                                        )
                                      ) : (
                                        <span>Pilih Tgl Masuk</span>
                                      )}
                                    </Button>
                                  </PopoverTrigger>
                                </FormControl>
                                <PopoverContent className='w-auto p-0'>
                                  <Calendar
                                    mode='single'
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    initialFocus
                                  />
                                  <div className='border-t border-border p-3'>
                                    <TimePicker
                                      setDate={field.onChange}
                                      date={field.value || new Date()}
                                    />
                                  </div>
                                </PopoverContent>
                              </Popover>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name='sifat'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Sifat Surat</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value || undefined}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Pilih Sifat Surat' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {ESifat.enumValues.map((sifat) => {
                                    return (
                                      <SelectItem
                                        value={sifat}
                                        key={sifat}
                                        className='uppercase'
                                      >
                                        {sifat.split('_').join(' ')}
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
                          name='status'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Status Surat</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value || ''}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Pilih Status' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {EStatus.enumValues.map((status) => (
                                    <SelectItem value={status} key={status}>
                                      {status?.split('_').join(' ')}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name='pengirim'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Pengirim</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder='Masukkan Pengirim'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name='kategori_id'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Kategori Surat</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value?.toString()}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Pilih Kategori' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {dataKategori?.map((kategori, index) => {
                                    return (
                                      <SelectItem
                                        value={kategori.id?.toString()}
                                        key={index}
                                      >
                                        {kategori.nama}
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
                          name='keterangan'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Keterangan</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder='Masukkan Keterangan'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name='tgl_dikirim'
                          render={({ field }) => (
                            <FormItem className='flex flex-col'>
                              <FormLabel>Tgl Dikirim</FormLabel>
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
                                        format(
                                          field.value,
                                          'EEEE, dd MMMM yyyy',
                                        )
                                      ) : (
                                        <span>Pilih Tanggal Dikirim</span>
                                      )}
                                      <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                  className='w-auto p-0'
                                  align='start'
                                >
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
                      </div>
                    </Step>
                    <Step label={steps[2].label}>
                      <div className='my-4 space-y-3 px-2'>
                        <FormField
                          control={form.control}
                          name='peminta'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Peminta</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder='Masukkan Peminta'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name='perihal'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Perihal</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder='Masukkan Perihal'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name='ditujukan'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ditujukan</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder='Ditujukan Kepada'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name='tgl_kegiatan'
                          render={({ field }) => (
                            <FormItem className='flex flex-col'>
                              <FormLabel>Tgl Kegiatan</FormLabel>
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
                                        format(
                                          field.value,
                                          'EEEE, dd MMMM yyyy',
                                        )
                                      ) : (
                                        <span>Pilih Tanggal Kegiatan</span>
                                      )}
                                      <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                  className='w-auto p-0'
                                  align='start'
                                >
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
                          name='nama_kegiatan'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nama Kegiatan</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder='Masukkan Nama Kegiatan'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name='tempat'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tempat Kegiatan</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder='Masukkan Tempat Kegiatan'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name='jam'
                          render={({ field }) => (
                            <FormItem className='flex flex-col'>
                              <FormLabel className='text-left'>
                                Jam Kegiatan
                              </FormLabel>
                              <Popover>
                                <FormControl>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant='outline'
                                      className={cn(
                                        'w-full justify-start text-left font-normal',
                                        !field.value && 'text-muted-foreground',
                                      )}
                                    >
                                      <CalendarIcon className='mr-2 h-4 w-4' />
                                      {field.value ? (
                                        format(field.value, 'HH:mm:ss')
                                      ) : (
                                        <span>Isi Jam</span>
                                      )}
                                    </Button>
                                  </PopoverTrigger>
                                </FormControl>
                                <PopoverContent className='w-auto p-0'>
                                  <div className='border-t border-border p-3'>
                                    <TimePicker
                                      setDate={field.onChange}
                                      date={field.value || new Date()}
                                    />
                                  </div>
                                </PopoverContent>
                              </Popover>
                            </FormItem>
                          )}
                        />
                      </div>
                    </Step>
                    <Step label={steps[3].label}>
                      <div className='my-4 px-2'>
                        <FileUploaderMultiple
                          pathFiles={pathFiles}
                          setPathFiles={setPathFiles}
                        />
                      </div>
                    </Step>
                    <div className='px-2'>
                      <Footer
                        reset={reset}
                        onSubmit={onSubmit}
                        isLoading={isPending}
                      />
                    </div>
                  </Stepper>
                </ScrollArea>
              </div>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

const Footer = ({
  reset,
  onSubmit,
  isLoading,
}: {
  reset: UseFormReset<FieldValues>;
  onSubmit: () => void;
  isLoading: boolean;
}) => {
  const { nextStep, prevStep, isDisabledStep, isLastStep, isOptionalStep } =
    useStepper();
  return (
    <>
      <div className='flex w-full justify-between gap-2'>
        <Button
          variant='destructive'
          type='reset'
          onClick={() => {
            reset();
          }}
        >
          Reset Form
        </Button>
        <div className='flex gap-2'>
          <Button
            disabled={isDisabledStep}
            onClick={prevStep}
            size='sm'
            variant='secondary'
            type='button'
          >
            Prev
          </Button>
          <Button
            size='sm'
            onClick={() => (isLastStep ? onSubmit() : nextStep())}
            type='button'
            disabled={isLoading}
          >
            {isLastStep ? 'Submit' : isOptionalStep ? 'Skip' : 'Next'}
          </Button>
        </div>
      </div>
    </>
  );
};
