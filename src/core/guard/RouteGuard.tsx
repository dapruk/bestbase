import { Navigate } from '@tanstack/react-router';
import { evaluateTanStackGuard } from 'guardap/drivers/tanstack';

import { useAuth } from '@/core/auth/use-auth';
import { resolveAppConfig } from '@/core/config/resolve-app-config';
import { LoadingState } from '@/shared/components/feedback/loading-state';

import { appGuard } from './guard.config';
import type { AppGuardRouteMeta } from './guard.types';

interface RouteGuardProps {
  children: React.ReactNode;
  meta?: AppGuardRouteMeta | undefined;
}

export function RouteGuard({ children, meta }: RouteGuardProps) {
  const auth = useAuth();
  const config = resolveAppConfig();

  if (meta?.public) {
    return children;
  }

  if (auth.status === 'idle' || auth.status === 'checking') {
    return <LoadingState title="Memeriksa sesi" />;
  }

  if (auth.status !== 'authenticated') {
    return <Navigate replace to={config.router.defaultLoginPath} />;
  }

  const allowed = evaluateTanStackGuard(appGuard, meta, {
    conditions: auth.session?.user.conditions ?? {},
    isAuthenticated: true,
    roles: auth.session?.user.roles ?? [],
  });

  if (!allowed) {
    return <Navigate replace to={config.guard.forbiddenPath} />;
  }

  return children;
}
