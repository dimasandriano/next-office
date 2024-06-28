export type AxiosResError<T = string> = {
  error: T | string;
  status: string;
};
