import Cookies from 'js-cookie';

import instance from '@/lib/axios/instance';

const token = Cookies.get('token');
const headers = {
  Authorization: 'Bearer ' + token,
};
export const kategoriService = {
  getAllKategori: async () => {
    const { data } = await instance.get('/kategori/list', {
      headers,
    });
    return data.data;
  },
};
