'use client';
import { format } from 'date-fns';
import { id } from 'date-fns/locale/id';
import React from 'react';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Table, TableCell, TableRow } from '@/components/ui/table';

import { ESifat } from '@/enums/sifat.enum';

import { TSchemaLamaran } from '@/types/lamaran.type';

export default function DisposisiLamaranPdf({
  data,
}: {
  data: TSchemaLamaran;
}) {
  return (
    <div className='space-y-3 p-2'>
      <Table className='w-full *:hover:bg-background'>
        <TableRow>
          <TableCell className='w-1/2 border-2 border-black text-center'>
            UNIVERSITAS ISLAM BALITAR <br /> Jl. Majapahit No 4-6 Kota Blitar
          </TableCell>
          <TableCell className='w-1/2 border-2 border-black p-0 *:p-1'>
            <p className='border-b-2 border-black'>No Dok :</p>
            <p className='border-b-2 border-black'>
              Tanggal : {format(data.tgl, 'dd MMMM yyyy', { locale: id })}
            </p>
            <p className='border-b-2 border-black'>Jmlh Lbr:</p>
            <p className='invisible border-black'>Ket</p>
          </TableCell>
        </TableRow>
        <TableRow className='w-full'>
          <TableCell
            className='border-2 border-black p-0 text-center font-bold'
            colSpan={2}
          >
            LEMBAR DISPOSISI
          </TableCell>
        </TableRow>
      </Table>
      <Table className='w-full *:hover:bg-background'>
        <TableRow>
          <TableCell className='w-1/2 border-2 border-black text-center'>
            <div className='flex items-center justify-between px-1'>
              {ESifat.enumValues.map((sifat) => (
                <div
                  key={sifat}
                  className='flex items-center space-x-0.5 space-y-0'
                >
                  <Checkbox disabled />
                  <Label className='font-semibold uppercase'>{sifat}</Label>
                </div>
              ))}
            </div>
          </TableCell>
          <TableCell className='w-1/2 border-2 border-black p-0 *:p-1'>
            <p className='border-b-2 border-black'>
              Tgl Diterima : {format(data.tgl, 'dd MMMM yyyy', { locale: id })}
            </p>
            <p className=''>Tgl Penyelesaian :</p>
          </TableCell>
        </TableRow>
        <TableRow className='w-full'>
          <TableCell className='border-2 border-black p-2' colSpan={2}>
            <div className='flex items-start justify-between gap-2'>
              <p>Perihal : </p>
              <p className='flex-1'>Lamaran Pekerjaan</p>
            </div>
            <div className='flex items-start justify-between gap-2'>
              <p>Tgl/No : </p>
              <p className='flex-1'>
                {format(data.tgl, 'dd MMMM yyyy', { locale: id })}
              </p>
            </div>
            <div className='flex items-start justify-between gap-2'>
              <p>Asal : </p>
              <p className='flex-1'>{data.pelamar}</p>
            </div>
          </TableCell>
        </TableRow>
        <TableRow className='min-h-96 '>
          <TableCell className='w-1/2 border-2 border-black'>
            <div className='flex flex-col space-y-36'>
              <div className='space-y-2'>
                <p className='font-medium uppercase'>Disposisi :</p>
                <p>{data.disposisi?.note_penerima}</p>
                <p>
                  {format(
                    data.disposisi?.tgl_diterima || new Date(),
                    'dd MMMM yyyy',
                    {
                      locale: id,
                    },
                  )}
                </p>
              </div>
              <p>To : {data.disposisi?.divisi?.nama}</p>
            </div>
          </TableCell>
          <TableCell className='w-1/2 border-2 border-black p-4 align-top'>
            <div className='flex flex-col justify-between space-y-36'>
              <div className='space-y-2'>
                <p className='font-medium uppercase'>KEPADA :</p>
                <p>{data.disposisi?.note_pengirim}</p>
                <p>
                  {format(data.tgl_dikirim, 'dd MMMM yyyy', { locale: id })}
                </p>
              </div>
              <p></p>
            </div>
          </TableCell>
        </TableRow>
        <TableRow className='w-full'>
          <TableCell className='border-2 border-black p-2' colSpan={2}>
            Isi : {data.disposisi?.isi}
          </TableCell>
        </TableRow>
      </Table>
    </div>
  );
}
