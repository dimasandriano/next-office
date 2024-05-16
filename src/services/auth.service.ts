import instance from '@/lib/axios/instance';

import { TLogin, TResponseLogin } from '@/types/auth.type';

export const authService = {
  authLogin: (data: TLogin): Promise<{ data: TResponseLogin }> =>
    instance.post('/auth/login', data),
};
