import Cookies from 'js-cookie';

import instance from '@/lib/axios/instance';

import { TParams } from '@/types/params.type';
const token = Cookies.get('token');
const headers = {
  Authorization: 'Bearer ' + token,
};

export const userService = {
  getAllUser: async (params: TParams) => {
    const { data } = await instance.get('/users/list', {
      params,
      headers,
    });
    return data;
  },
};
