import { count } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/drizzle/db';
import { divisi } from '@/lib/drizzle/schema/divisi.schema';
import { kategori } from '@/lib/drizzle/schema/kategori.schema';
import { lamaran } from '@/lib/drizzle/schema/lamaran.schema';
import { surat } from '@/lib/drizzle/schema/surat.schema';
import { users } from '@/lib/drizzle/schema/users.schema';
import useVerifyJwt from '@/hooks/useVerifyJwt';

export async function GET(request: NextRequest) {
  const verify = useVerifyJwt(request);
  if (!verify) {
    return NextResponse.json(
      { status: 'error', error: 'Unauthorized' },
      {
        status: 401,
      },
    );
  }
  const countSurat = await db.select({ value: count(surat.id) }).from(surat);
  const countKategori = await db
    .select({ value: count(kategori.id) })
    .from(kategori);
  const countDivisi = await db.select({ value: count(divisi.id) }).from(divisi);
  const countUser = await db.select({ value: count(users.id) }).from(users);
  const countLamaran = await db
    .select({ value: count(lamaran.id) })
    .from(lamaran);

  return NextResponse.json({
    status: 'Success',
    data: {
      surat: countSurat[0]?.value,
      kategori: countKategori[0]?.value,
      divisi: countDivisi[0]?.value,
      user: countUser[0]?.value,
      lamaran: countLamaran[0]?.value,
    },
  });
}
