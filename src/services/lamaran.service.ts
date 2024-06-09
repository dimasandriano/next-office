import instance from '@/lib/axios/instance';

import { TSchemaLamaran } from '@/types/lamaran.type';
import { TParams } from '@/types/params.type';

type TParamsLamaran = TParams & {
  status?: string;
  start_date?: string | Date;
  finish_date?: string | Date;
};

export const lamaranService = {
  getAllLamaran: async (params: TParamsLamaran) => {
    const { data } = await instance.get('/lamaran/list', {
      params,
    });
    return data;
  },

  createLamaran: async (data: Partial<TSchemaLamaran>) => {
    const { data: response } = await instance.post('/lamaran/create', data);
    return response;
  },

  deleteLamaran: async (id: string) => {
    const { data: result } = await instance.delete(`/lamaran/delete/${id}`);
    return result.data;
  },
};
