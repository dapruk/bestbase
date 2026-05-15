import { QueryClientProvider } from '@tanstack/react-query';
import { useMemo } from 'react';

import { createAppQueryClient } from './query-client';

interface AppQueryProviderProps {
  children: React.ReactNode;
}

export function AppQueryProvider({ children }: AppQueryProviderProps) {
  const queryClient = useMemo(() => createAppQueryClient(), []);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
