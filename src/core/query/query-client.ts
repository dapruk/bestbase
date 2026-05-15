import { QueryClient } from '@tanstack/react-query';

import { resolveAppConfig } from '@/core/config/resolve-app-config';

export function createAppQueryClient(): QueryClient {
  const config = resolveAppConfig();

  return new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: config.query.gcTime,
        refetchOnWindowFocus: config.query.refetchOnWindowFocus,
        retry: config.query.retry,
        staleTime: config.query.staleTime,
      },
    },
  });
}
