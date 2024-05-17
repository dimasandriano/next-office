import Cookies from 'js-cookie';

import instance from '@/lib/axios/instance';
const token = Cookies.get('token');

export const informationService = {
  informationHeader: () =>
    instance
      .get('/information/header', {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then((res) => res.data.data),
};
