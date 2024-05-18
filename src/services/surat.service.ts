import instance from '@/lib/axios/instance';

import { TParams } from '@/types/params.type';

type TParamsSurat = TParams & {
  status?: string;
  start_date?: string | Date;
  finish_date?: string | Date;
};

export const suratService = {
  getAllSurat: async (params: TParamsSurat) => {
    const { data } = await instance.get('/surat/list', {
      params,
    });
    return data;
  },
};
