import Cookies from 'js-cookie';

import instance from '@/lib/axios/instance';

import { TSchemaKategori } from '@/types/kategori.type';
import { TParams } from '@/types/params.type';

const token = Cookies.get('token');
const headers = {
  Authorization: 'Bearer ' + token,
};
export const kategoriService = {
  getAllKategori: async (params?: TParams) => {
    const { data } = await instance.get('/kategori/list', {
      headers,
      params,
    });
    return data.data;
  },
  getAllListKategori: async (params?: TParams) => {
    const { data } = await instance.get('/kategori/list', {
      headers,
      params,
    });
    return data;
  },
  deleteKategori: async (id: string) => {
    const { data } = await instance.delete(`/kategori/delete/${id}`, {
      headers,
    });
    return data.data;
  },

  createKategori: async (data: TSchemaKategori) => {
    const { data: result } = await instance.post('/kategori/create', data, {
      headers,
    });
    return result.data;
  },

  updateKategori: async (data: Partial<TSchemaKategori>) => {
    const { data: result } = await instance.put(
      `/kategori/edit/${data.id}`,
      data,
      {
        headers,
      },
    );
    return result.data;
  },
};
