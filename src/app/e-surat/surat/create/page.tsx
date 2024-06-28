/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { toastError } from '@/lib/sonner/toast-error.sonner';
import { cn } from '@/lib/utils';

import Breadcrumb from '@/components/molecules/Breadcrumb';
import { TimePicker } from '@/components/molecules/TimePicker';
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
import { Textarea } from '@/components/ui/textarea';

import { ESifat } from '@/enums/sifat.enum';
import { ETipe } from '@/enums/tipe.enum';
import { kategoriService } from '@/services/kategori.service';
import { suratService } from '@/services/surat.service';

import { AxiosResError } from '@/types/axios-res-error.type';
import { TSchemaKategori } from '@/types/kategori.type';
import { TSchemaSurat } from '@/types/surat.type';

export default function Page() {
  const pages = [
    {
      label: 'Surat',
      url: '/e-surat/surat',
    },
    {
      label: 'Tambah Surat',
      url: `/e-surat/surat/create`,
    },
  ];
  const form = useForm<TSchemaSurat>({
    mode: 'all',
  });
  const { handleSubmit, reset, resetField } = form;

  const { mutate: mutateCreateSurat } = useMutation({
    mutationKey: ['create-surat'],
    mutationFn: (data: TSchemaSurat) => suratService.createSurat(data),
    onSuccess: () => {
      toast.success('Surat created successfully');
      reset();
      resetField('sifat');
    },
    onError: (error: AxiosError<AxiosResError>) =>
      toastError('Gagal Membuat Surat', error),
  });

  const onSubmit = useCallback(
    (data: TSchemaSurat) => {
      mutateCreateSurat({ ...data, kategori_id: Number(data.kategori_id) });
    },
    [mutateCreateSurat],
  );

  const { data: dataKategori } = useQuery<TSchemaKategori[]>({
    queryKey: ['kategoris'],
    queryFn: () => kategoriService.getAllKategori(),
  });

  return (
    <div className='space-y-3'>
      <div>
        <Breadcrumb pages={pages} />
        <h1 className='text-2xl font-semibold'>Tambah Surat</h1>
      </div>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='grid grid-cols-12 gap-3'>
            <div className='col-span-6 space-y-2'>
              <FormField
                control={form.control}
                name='tipe'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipe Surat</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Pilih Tipe Surat' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ETipe.enumValues.map((tipe) => {
                          return (
                            <SelectItem
                              value={tipe}
                              key={tipe}
                              className='uppercase'
                            >
                              {tipe.split('_').join(' ')}
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
                name='no_surat'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>No Surat</FormLabel>
                    <FormControl>
                      <Input placeholder='Masukkan No Surat' {...field} />
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
                    <FormLabel className='text-left'>Tanggal Masuk</FormLabel>
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
                              format(field.value, 'EEEE, dd MMMM yyyy HH:mm:ss')
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
                name='pengirim'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pengirim</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Masukkan Pengirim'
                        {...(field as any)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='peminta'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Peminta</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Masukkan Peminta'
                        {...(field as any)}
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
              <Button type='submit'>Kirim</Button>
            </div>
            <div className='col-span-6 space-y-2'>
              <FormField
                control={form.control}
                name='perihal'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Perihal</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Masukkan Perihal'
                        {...(field as any)}
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
                        {...(field as any)}
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
                              'w-[240px] pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'EEEE, dd MMMM yyyy')
                            ) : (
                              <span>Pilih Tanggal Kegiatan</span>
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
                name='nama_kegiatan'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Kegiatan</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Masukkan Nama Kegiatan'
                        {...(field as any)}
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
                        {...(field as any)}
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
                        {...(field as any)}
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
                              'w-[240px] pl-3 text-left font-normal',
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
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
