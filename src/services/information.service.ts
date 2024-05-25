import instance from '@/lib/axios/instance';

export const informationService = {
  informationHeader: () =>
    instance.get('/information/header').then((res) => res.data.data),
};
