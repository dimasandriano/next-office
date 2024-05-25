import instance from '@/lib/axios/instance';

import { TSchemaKategori } from '@/types/kategori.type';
import { TParams } from '@/types/params.type';

export const kategoriService = {
  getAllKategori: async (params?: TParams) => {
    const { data } = await instance.get('/kategori/list', {
      params,
    });
    return data.data;
  },
  getAllListKategori: async (params?: TParams) => {
    const { data } = await instance.get('/kategori/list', {
      params,
    });
    return data;
  },
  deleteKategori: async (id: string) => {
    const { data } = await instance.delete(`/kategori/delete/${id}`);
    return data.data;
  },

  createKategori: async (data: TSchemaKategori) => {
    const { data: result } = await instance.post('/kategori/create', data);
    return result.data;
  },

  updateKategori: async (data: Partial<TSchemaKategori>) => {
    const { data: result } = await instance.put(
      `/kategori/edit/${data.id}`,
      data,
    );
    return result.data;
  },
};
