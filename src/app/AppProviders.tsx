import { AuthProvider } from '@/core/auth/auth.provider';
import { GuardProvider } from '@/core/guard/guard.config';
import { AppQueryProvider } from '@/core/query/query-provider';
import { TooltipProvider } from '@/shared/components/ui/tooltip';

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AppQueryProvider>
      <AuthProvider>
        <GuardProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </GuardProvider>
      </AuthProvider>
    </AppQueryProvider>
  );
}
