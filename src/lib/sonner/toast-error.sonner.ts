import { AxiosError } from 'axios';
import { toast } from 'sonner';

import { AxiosResError } from '@/types/axios-res-error.type';

export const toastError = (title: string, error: AxiosError<AxiosResError>) => {
  return toast.error(title, {
    description: error.response?.data?.error,
  });
};
