import { and, between, count, eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/drizzle/db';
import { divisi } from '@/lib/drizzle/schema/divisi.schema';
import { kategori } from '@/lib/drizzle/schema/kategori.schema';
import { lamaran } from '@/lib/drizzle/schema/lamaran.schema';
import { surat } from '@/lib/drizzle/schema/surat.schema';
import { users } from '@/lib/drizzle/schema/users.schema';
import { UnauthorizedError } from '@/lib/exceptions';
import useSearchParams from '@/hooks/useSearchParams';
import useVerifyJwt from '@/hooks/useVerifyJwt';

export async function GET(request: NextRequest) {
  const verify = useVerifyJwt(request);
  if (!verify) return UnauthorizedError();
  const { start_date, finish_date } = useSearchParams(request);

  const countSuratMasuk = await db
    .select({ value: count(surat.id) })
    .from(surat)
    .where(
      and(
        eq(surat.tipe, 'surat_masuk'),
        start_date && finish_date
          ? between(
              surat.created_at,
              new Date(start_date),
              new Date(finish_date),
            )
          : undefined,
      ),
    );
  const countSuratKeluar = await db
    .select({ value: count(surat.id) })
    .from(surat)
    .where(
      and(
        eq(surat.tipe, 'surat_keluar'),
        start_date && finish_date
          ? between(
              surat.created_at,
              new Date(start_date),
              new Date(finish_date),
            )
          : undefined,
      ),
    );
  const countSuratExternal = await db
    .select({ value: count(surat.id) })
    .from(surat)
    .where(
      and(
        eq(surat.tipe, 'surat_external'),
        start_date && finish_date
          ? between(
              surat.created_at,
              new Date(start_date),
              new Date(finish_date),
            )
          : undefined,
      ),
    );
  const countKategori = await db
    .select({ value: count(kategori.id) })
    .from(kategori)
    .where(
      start_date && finish_date
        ? between(
            kategori.created_at,
            new Date(start_date),
            new Date(finish_date),
          )
        : undefined,
    );
  const countDivisi = await db
    .select({ value: count(divisi.id) })
    .from(divisi)
    .where(
      start_date && finish_date
        ? between(
            divisi.created_at,
            new Date(start_date),
            new Date(finish_date),
          )
        : undefined,
    );
  const countUser = await db
    .select({ value: count(users.id) })
    .from(users)
    .where(
      start_date && finish_date
        ? between(users.created_at, new Date(start_date), new Date(finish_date))
        : undefined,
    );
  const countLamaran = await db
    .select({ value: count(lamaran.id) })
    .from(lamaran)
    .where(
      start_date && finish_date
        ? between(
            lamaran.created_at,
            new Date(start_date),
            new Date(finish_date),
          )
        : undefined,
    );

  return NextResponse.json({
    status: 'Success',
    data: {
      suratMasuk: countSuratMasuk[0]?.value,
      suratKeluar: countSuratKeluar[0]?.value,
      suratExternal: countSuratExternal[0]?.value,
      kategori: countKategori[0]?.value,
      divisi: countDivisi[0]?.value,
      user: countUser[0]?.value,
      lamaran: countLamaran[0]?.value,
    },
  });
}
