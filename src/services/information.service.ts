import instance from '@/lib/axios/instance';

import { TParams } from '@/types/params.type';

export const informationService = {
  informationHeader: (params: TParams) =>
    instance
      .get('/information/header', { params })
      .then((res) => res.data.data),
};
