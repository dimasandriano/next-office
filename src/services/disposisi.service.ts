import instance from '@/lib/axios/instance';

import { TSchemaDisposisi } from '@/types/disposisi.type';
import { TParams } from '@/types/params.type';

export const disposisiService = {
  getAllDisposisi: async () => {
    const { data } = await instance.get('/disposisi/list');
    return data.data;
  },

  createDisposisi: async (data: Partial<TSchemaDisposisi>) => {
    const { data: result } = await instance.post('/disposisi/create', data);
    return result.data;
  },

  updateDisposisi: async (data: Partial<TSchemaDisposisi>) => {
    const { data: result } = await instance.put(
      `/disposisi/edit/${data.id}`,
      data,
    );
    return result.data;
  },

  getAllDisposisiUser: async (params: TParams) => {
    const { data } = await instance.get('/disposisi/user/list', { params });
    return data;
  },
};
