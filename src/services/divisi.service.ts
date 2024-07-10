import instance from '@/lib/axios/instance';

import { TSchemaDivisi } from '@/types/divisi.type';
import { TParams } from '@/types/params.type';
export const divisiService = {
  getAllDivisi: async (params: TParams) => {
    const { data } = await instance.get('/divisi/list', {
      params,
    });
    return data;
  },

  getAllDivisiSelection: async (params?: TParams) => {
    const { data } = await instance.get('/divisi/list', {
      params,
    });
    return data.data;
  },

  createDivisi: async (data: TSchemaDivisi) => {
    const { data: result } = await instance.post('/divisi/create', data);
    return result.data;
  },

  updateDivisi: async (data: Partial<TSchemaDivisi>) => {
    const { data: result } = await instance.put(
      `/divisi/edit/${data.id}`,
      data,
    );
    return result.data;
  },

  deleteDivisi: async (id: string) => {
    const { data } = await instance.delete(`/divisi/delete/${id}`);
    return data.data;
  },
};
