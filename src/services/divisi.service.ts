import Cookies from 'js-cookie';

import instance from '@/lib/axios/instance';

import { TSchemaDivisi } from '@/types/divisi.type';
import { TParams } from '@/types/params.type';
const token = Cookies.get('token');
const headers = {
  Authorization: 'Bearer ' + token,
};
export const divisiService = {
  getAllDivisi: async (params: TParams) => {
    const { data } = await instance.get('/divisi/list', {
      params,
      headers,
    });
    return data;
  },

  createDivisi: async (data: TSchemaDivisi) => {
    const { data: result } = await instance.post('/divisi/create', data, {
      headers,
    });
    return result.data;
  },

  updateDivisi: async (data: Partial<TSchemaDivisi>) => {
    const { data: result } = await instance.put(
      `/divisi/edit/${data.id}`,
      data,
      {
        headers,
      },
    );
    return result.data;
  },

  deleteDivisi: async (id: string) => {
    const { data } = await instance.delete(`/divisi/delete/${id}`, {
      headers,
    });
    return data.data;
  },
};
