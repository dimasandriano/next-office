import { z } from 'zod';

export const UserSchemaZod = z.object({
  full_name: z.string().min(1, { message: 'Nama harus diisi' }),
  username: z.string().min(8, { message: 'Username harus diisi minimal 8' }),
  password: z.string().min(8, { message: 'Password harus diisi minimal 8' }),
  role: z.string().min(1, { message: 'Role harus diisi' }),
  is_active: z.string().min(1, { message: 'Status harus diisi' }),
});
export const UserEditSchemaZod = z.object({
  full_name: z.string().min(1, { message: 'Nama harus diisi' }),
  username: z.string().min(8, { message: 'Username harus diisi minimal 8' }),
  role: z.string().min(1, { message: 'Role harus diisi' }),
  is_active: z.string().min(1, { message: 'Status harus diisi' }),
});
