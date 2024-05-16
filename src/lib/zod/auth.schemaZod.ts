import { z } from 'zod';

export const ZloginSchema = z.object({
  username: z
    .string({ required_error: 'Username is required' })
    .min(3, { message: 'Username must be at least 3 characters' })
    .max(50, { message: 'Username must be less than 50 characters' })
    .regex(/^[a-zA-Z0-9]+$/, { message: 'Username must be alphanumeric' }),
  password: z
    .string({ required_error: 'Password is required' })
    .min(3, { message: 'Password must be at least 3 characters' })
    .max(50, { message: 'Password must be less than 50 characters' }),
});
