'use client';

import { useMutation } from '@tanstack/react-query';
import { format } from 'date-fns';
import _ from 'lodash';
import { CalendarIcon, PenBox } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import queryClient from '@/lib/tanstack';
import { cn } from '@/lib/utils';

import FileUploaderMultiple from '@/components/molecules/UploadMultiple';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
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
import { Input } from '@/components/ui/input';
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
import {
  type StepItem,
  Step,
  Stepper,
  useStepper,
} from '@/components/ui/stepper';
import { Textarea } from '@/components/ui/textarea';

import { EJenjang } from '@/enums/jenjang.enum';
import { EStatus } from '@/enums/status.enum';
import { lamaranService } from '@/services/lamaran.service';

import { TSchemaLamaran } from '@/types/lamaran.type';

export default function LamaranEditSheet({ data }: { data: TSchemaLamaran }) {
  const steps = [
    { label: 'Data Diri' },
    { label: 'Pendidikan' },
    { label: 'Lainnya' },
    { label: 'Dokumen' },
  ] satisfies StepItem[];
  const form = useForm({
    mode: 'onChange',
  });
  const { handleSubmit, resetField, reset, getValues, setValue } = form;
  const [pathFiles, setPathFiles] = useState<string[]>([]);
  const [educations, setEducations] = useState<number[]>([1]);

  const { mutate: mutateUpdateLamaran, isPending } = useMutation({
    mutationKey: ['updatelamaran'],
    mutationFn: (data: Partial<TSchemaLamaran>) =>
      lamaranService.updateLamaran(data),
    onSuccess: () => {
      toast.success('Lamaran Berhasil Diubah');
      reset();
      setPathFiles([]);
      queryClient.invalidateQueries({ queryKey: ['lamaran'] });
    },
    onError: () => toast.error('Lamaran Gagal Diubah'),
  });

  useEffect(() => {
    setValue('tgl', data.tgl);
    setValue('ttl', data.ttl);
    setValue('no_hp', data.no_hp);
    setValue('pelamar', data.pelamar);
    setValue('status', data.status);
    setValue('tgl_dikirim', data.tgl_dikirim);
    setValue('lampiran', data.lampiran);
    setValue('keterangan', data.keterangan);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = useCallback(() => {
    // grouping pendidikan
    const grouped = _.groupBy(Object.entries(getValues()), ([key, _value]) =>
      key ? key.match(/[a-zA-Z]+/)?.[0] : null,
    );
    const combinedPendidikan = _.zipWith(
      grouped.universitas,
      grouped.prodi,
      grouped.jenjang,
      grouped.gelar,
      grouped.ipk,
      grouped.tgllulus,
      (
        [_universitasKey, universitasValue],
        [_prodiKey, prodiValue],
        [_jenjangKey, jenjangValue],
        [_gelarKey, gelarValue],
        [_ipkKey, ipkValue],
        [_tgllulusKey, tgllulusValue],
      ) => ({
        universitas: universitasValue,
        prodi: prodiValue,
        jenjang: jenjangValue,
        gelar: gelarValue,
        ipk: ipkValue,
        tgllulus: tgllulusValue,
      }),
    );
    mutateUpdateLamaran({
      id: data.id,
      pendidikan: JSON.stringify(combinedPendidikan),
      files: JSON.stringify(pathFiles),
      tgl_dikirim: getValues().tgl_dikirim as Date,
      ...getValues(),
    });
  }, [data.id, getValues, mutateUpdateLamaran, pathFiles]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size='icon' variant='default'>
          <PenBox />
        </Button>
      </SheetTrigger>
      <SheetContent className='min-w-[50%]'>
        <SheetHeader>
          <SheetTitle>Edit Lamaran</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='mt-5 flex flex-col justify-between'>
              <div className='flex w-full flex-col gap-4'>
                <Stepper initialStep={0} steps={steps}>
                  <Step label={steps[0].label}>
                    <div className='my-4 space-y-3'>
                      <FormField
                        control={form.control}
                        name='tgl'
                        render={({ field }) => (
                          <FormItem className='flex flex-col'>
                            <FormLabel>Tanggal</FormLabel>
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
                                      <span>Pilih Tanggal</span>
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
                        name='pelamar'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nama Pelamar</FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Masukkan Nama Pelamar'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='ttl'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tempat, Tgl Lahir</FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Masukkan Tempat, Tgl Lahir'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='no_hp'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>No. HP</FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Masukkan No. HP'
                                type='number'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </Step>
                  <Step label={steps[1].label}>
                    <div className='my-4 space-y-3'>
                      <Accordion type='single' collapsible className='w-full'>
                        {educations.map((education, index) => (
                          <div
                            className='flex w-full items-start justify-between gap-3'
                            key={index}
                          >
                            <AccordionItem
                              value={index.toString()}
                              className='w-full'
                            >
                              <AccordionTrigger>
                                Pendidikan ke {index + 1}
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className='w-full space-y-3 px-3'>
                                  <FormField
                                    control={form.control}
                                    name={'universitas' + education}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>
                                          Universitas / Sekolah
                                        </FormLabel>
                                        <FormControl>
                                          <Input
                                            placeholder='Masukkan Universitas / Sekolah'
                                            {...field}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name={'prodi' + education}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Prodi / Jurusan</FormLabel>
                                        <FormControl>
                                          <Input
                                            placeholder='Masukkan Prodi / Jurusan'
                                            {...field}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name={'gelar' + education}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Gelar</FormLabel>
                                        <FormControl>
                                          <Input
                                            placeholder='Masukkan Gelar'
                                            {...field}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name={'jenjang' + education}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>
                                          Jenjang Pendidikan
                                        </FormLabel>
                                        <Select
                                          onValueChange={field.onChange}
                                          value={field.value || ''}
                                        >
                                          <FormControl>
                                            <SelectTrigger>
                                              <SelectValue placeholder='Pilih Jenjang Pendidikan' />
                                            </SelectTrigger>
                                          </FormControl>
                                          <SelectContent>
                                            {(
                                              Object.keys(EJenjang) as Array<
                                                keyof typeof EJenjang
                                              >
                                            ).map((jenjang) => {
                                              return (
                                                <SelectItem
                                                  value={jenjang}
                                                  key={jenjang}
                                                  className='uppercase'
                                                >
                                                  {jenjang.split('_').join(' ')}
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
                                    name={'ipk' + education}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>IPK</FormLabel>
                                        <FormControl>
                                          <Input
                                            placeholder='Masukkan IPK'
                                            type='number'
                                            {...field}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name={'tgllulus' + education}
                                    render={({ field }) => (
                                      <FormItem className='flex flex-col'>
                                        <FormLabel>Tanggal Lulus</FormLabel>
                                        <Popover>
                                          <PopoverTrigger asChild>
                                            <FormControl>
                                              <Button
                                                variant='outline'
                                                className={cn(
                                                  'w-full pl-3 text-left font-normal',
                                                  !field.value &&
                                                    'text-muted-foreground',
                                                )}
                                              >
                                                {field.value ? (
                                                  format(
                                                    field.value,
                                                    'EEEE, dd MMMM yyyy',
                                                  )
                                                ) : (
                                                  <span>
                                                    Pilih Tanggal Lulus
                                                  </span>
                                                )}
                                                <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                              </Button>
                                            </FormControl>
                                          </PopoverTrigger>
                                          <PopoverContent
                                            className='w-full p-0'
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
                              </AccordionContent>
                            </AccordionItem>
                            {educations.length > 1 && (
                              <Button
                                variant='destructive'
                                type='button'
                                onClick={() => {
                                  setEducations(
                                    educations.filter(
                                      (edu) => edu !== education,
                                    ),
                                  );
                                  resetField('universitas' + education);
                                }}
                              >
                                Hapus
                              </Button>
                            )}
                          </div>
                        ))}
                      </Accordion>
                    </div>
                    <Button
                      type='button'
                      className='w-full'
                      onClick={() =>
                        setEducations([
                          ...educations,
                          educations[educations.length - 1] + 1,
                        ])
                      }
                    >
                      Tambah Pendidikan
                    </Button>
                  </Step>
                  <Step label={steps[2].label}>
                    <div className='my-4 space-y-3'>
                      <FormField
                        control={form.control}
                        name='status'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status Lamaran</FormLabel>
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
                        name='tgl_dikirim'
                        render={({ field }) => (
                          <FormItem className='flex flex-col'>
                            <FormLabel>Tanggal Dikirim</FormLabel>
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
                                      <span>Pilih Tanggal Dikirim</span>
                                    )}
                                    <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className='w-full p-0'
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
                        name='lampiran'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Lampiran</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder='Masukkan Lampiran'
                                {...field}
                              />
                            </FormControl>
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
                    </div>
                  </Step>
                  <Step label={steps[3].label}>
                    <div className='my-4'>
                      <FileUploaderMultiple
                        pathFiles={pathFiles}
                        setPathFiles={setPathFiles}
                      />
                    </div>
                  </Step>
                  <Footer onSubmit={onSubmit} isLoading={isPending} />
                </Stepper>
              </div>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

const Footer = ({
  onSubmit,
  isLoading,
}: {
  onSubmit: () => void;
  isLoading: boolean;
}) => {
  const { nextStep, prevStep, isDisabledStep, isLastStep, isOptionalStep } =
    useStepper();
  return (
    <>
      <div className='flex w-full justify-end'>
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
