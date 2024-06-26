import { z } from 'zod';

export const KategoriSchemaZod = z.object({
  nama: z.string().min(1, { message: 'Nama divisi harus diisi' }),
  keterangan: z.string().min(1, { message: 'Keterangan divisi harus diisi' }),
});
