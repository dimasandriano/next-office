import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      gcTime: 1000 * 60 * 60 * 24,
    },
  },
});

export default queryClient;
