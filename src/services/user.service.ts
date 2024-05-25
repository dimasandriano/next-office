import instance from '@/lib/axios/instance';

import { TParams } from '@/types/params.type';

export const userService = {
  getAllUser: async (params: TParams) => {
    const { data } = await instance.get('/users/list', {
      params,
    });
    return data;
  },
};
