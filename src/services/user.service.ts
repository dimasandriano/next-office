import instance from '@/lib/axios/instance';

import { TParams } from '@/types/params.type';
import { TChangePasswordUser, TSchemaUsers } from '@/types/users.type';

export const userService = {
  getAllUser: async (params: TParams) => {
    const { data } = await instance.get('/users/list', {
      params,
    });
    return data;
  },

  createUser: async (data: TSchemaUsers) => {
    const { data: result } = await instance.post('/users/create', data);
    return result.data;
  },

  deleteUser: async (id: string) => {
    const { data: result } = await instance.delete(`/users/delete/${id}`);
    return result.data;
  },

  updateUser: async (data: Partial<TSchemaUsers>) => {
    const { data: result } = await instance.put(`/users/edit/${data.id}`, data);
    return result.data;
  },

  changePasswordUser: async (data: TChangePasswordUser) => {
    const { data: result } = await instance.put(
      `/users/change-password/${data.id}`,
      data,
    );
    return result.data;
  },
};
