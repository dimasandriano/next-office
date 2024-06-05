import instance from '@/lib/axios/instance';

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
};
