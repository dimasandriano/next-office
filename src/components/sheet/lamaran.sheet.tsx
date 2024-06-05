'use client';

import { format } from 'date-fns';
import { CalendarIcon, Plus } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';

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
  SheetClose,
  SheetContent,
  SheetFooter,
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

import { EJenjang } from '@/enums/jenjang.enum';

export default function LamaranSheet() {
  const steps = [
    { label: 'Data Diri' },
    { label: 'Pendidikan' },
    { label: 'Lainnya' },
    { label: 'Dokumen' },
  ] satisfies StepItem[];
  const form = useForm({
    mode: 'all',
  });
  const { handleSubmit, resetField } = form;
  const [educations, setEducations] = useState<number[]>([1]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = useCallback((data: any) => {
    // eslint-disable-next-line no-console
    console.log(data);
  }, []);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <span className='mr-1 text-xl'>
            <Plus />
          </span>
          Tambah Lamaran
        </Button>
      </SheetTrigger>
      <SheetContent className='min-w-[50%]'>
        <SheetHeader>
          <SheetTitle>Tambah Lamaran</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='mt-5 flex flex-col justify-between'>
              <div className='flex w-full flex-col gap-4'>
                <Stepper initialStep={0} steps={steps}>
                  <Step label={steps[0].label}>
                    <div className='my-4 w-1/2 space-y-3'>
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
                                        <FormLabel>Universitas</FormLabel>
                                        <FormControl>
                                          <Input
                                            placeholder='Masukkan Universitas'
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
                                        <FormLabel>Prodi</FormLabel>
                                        <FormControl>
                                          <Input
                                            placeholder='Masukkan Prodi'
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
                                          defaultValue={field.value}
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
                                    name={'tgl_lulus' + education}
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
                    <div className='my-4 flex h-40 items-center justify-center rounded-md border bg-secondary text-primary'>
                      <h1 className='text-xl'>Step</h1>
                    </div>
                  </Step>
                  <Step label={steps[3].label}>
                    <div className='my-4'>
                      <FileUploaderMultiple />
                    </div>
                  </Step>

                  <Footer />
                </Stepper>
              </div>
            </div>
          </form>
        </Form>
        <SheetFooter>
          <SheetClose asChild>footer content</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

const Footer = () => {
  const {
    nextStep,
    prevStep,
    resetSteps,
    isDisabledStep,
    hasCompletedAllSteps,
    isLastStep,
    isOptionalStep,
  } = useStepper();
  return (
    <>
      {hasCompletedAllSteps && (
        <div className='my-4 flex h-40 items-center justify-center rounded-md border bg-secondary text-primary'>
          <h1 className='text-xl'>Woohoo! All steps completed! 🎉</h1>
        </div>
      )}
      <div className='flex w-full justify-end gap-2'>
        {hasCompletedAllSteps ? (
          <Button size='sm' type='button' onClick={resetSteps}>
            Reset
          </Button>
        ) : (
          <>
            <Button
              disabled={isDisabledStep}
              onClick={prevStep}
              size='sm'
              variant='secondary'
              type='button'
            >
              Prev
            </Button>
            <Button size='sm' onClick={nextStep} type='button'>
              {isLastStep ? 'Finish' : isOptionalStep ? 'Skip' : 'Next'}
            </Button>
          </>
        )}
      </div>
    </>
  );
};
