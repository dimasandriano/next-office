import Cookies from 'js-cookie';

import instance from '@/lib/axios/instance';

import { TParams } from '@/types/params.type';
import { TSchemaSurat } from '@/types/surat.type';

type TParamsSurat = TParams & {
  status?: string;
  tipe?: string;
  start_date?: string | Date;
  finish_date?: string | Date;
};

const token = Cookies.get('token');
const headers = {
  Authorization: 'Bearer ' + token,
};

export const suratService = {
  getAllSurat: async (params: TParamsSurat) => {
    const { data } = await instance.get('/surat/list', {
      params,
      headers,
    });
    return data;
  },

  getSuratById: async (id: string) => {
    const { data } = await instance.get(`/surat/${id}`, {
      headers,
    });
    return data.data;
  },

  createSurat: async (data: TSchemaSurat) => {
    const { data: response } = await instance.post('/surat/create', data, {
      headers,
    });
    return response;
  },
};
