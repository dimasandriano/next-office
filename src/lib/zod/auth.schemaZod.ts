import { z } from 'zod';

export const ZloginSchema = z.object({
  username: z
    .string({ required_error: 'Username is required' })
    .min(8, { message: 'Username harus diisi minimal 8' })
    .max(50, { message: 'Username must be less than 50 characters' })
    .regex(/^[a-zA-Z0-9]+$/, { message: 'Username harus diisi tanpa spasi' }),
  password: z
    .string({ required_error: 'Password is required' })
    .min(8, { message: 'Password harus diisi minimal 8' })
    .max(50, { message: 'Password must be less than 50 characters' }),
});
