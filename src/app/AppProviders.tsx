import { AuthProvider } from '@/core/auth/auth.provider';
import { AppQueryProvider } from '@/core/query/query-provider';

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AppQueryProvider>
      <AuthProvider>{children}</AuthProvider>
    </AppQueryProvider>
  );
}
