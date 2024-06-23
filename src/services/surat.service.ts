import instance from '@/lib/axios/instance';

import { TParams } from '@/types/params.type';
import { TSchemaSurat } from '@/types/surat.type';

type TParamsSurat = TParams & {
  status?: string;
  tipe?: string;
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

  getSuratById: async (id: string) => {
    const { data } = await instance.get(`/surat/${id}`);
    return data.data;
  },

  createSurat: async (data: Partial<TSchemaSurat>) => {
    const { data: response } = await instance.post('/surat/create', data);
    return response;
  },

  deleteSurat: async (id: string) => {
    const { data } = await instance.delete(`/surat/delete/${id}`);
    return data;
  },
};
