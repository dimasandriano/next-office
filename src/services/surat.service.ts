import Cookies from 'js-cookie';

import instance from '@/lib/axios/instance';

import { TParams } from '@/types/params.type';

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
};
