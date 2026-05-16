import { Navigate } from '@tanstack/react-router';
import type { IGuardChain } from 'guardap';

import { useAuth } from '@/core/auth/use-auth';
import { resolveAppConfig } from '@/core/config/resolve-app-config';
import { LoadingState } from '@/shared/components/feedback/loading-state';

import { Guard } from './guard.config';
import type {
  AppAction,
  AppCondition,
  AppFeature,
  AppGroup,
  AppGuardMeta,
  AppRole,
  AppRoutePath,
} from './guard.types';

interface RouteGuardProps {
  children: React.ReactNode;
  meta?: AppGuardMeta | undefined;
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

  const allowed = evaluateRouteGuard(meta);

  if (!allowed) {
    const isAuthenticated = auth.status === 'authenticated';
    const fallbackPath = isAuthenticated
      ? config.guard.forbiddenPath
      : config.router.defaultLoginPath;

    return (
      <Navigate
        replace
        to={(meta?.redirectTo ?? fallbackPath) as '/login' | '/forbidden'}
      />
    );
  }

  return children;
}

export function evaluateRouteGuard(meta?: AppGuardMeta) {
  if (!meta) {
    return Guard.requireLogin().allowed();
  }

  let chain: IGuardChain<
    AppRole,
    AppFeature,
    AppAction,
    AppCondition,
    AppGroup,
    unknown,
    AppRoutePath
  > = meta.login ? Guard.requireLogin() : Guard.with(undefined);

  if (meta.guest) {
    chain = chain.guestOnly();
  }

  if (meta.role) {
    chain =
      typeof meta.role === 'string'
        ? chain.requireRole(meta.role)
        : chain.requireRole(meta.role);
  }

  if (meta.group) {
    chain =
      typeof meta.group === 'string'
        ? chain.requireGroup(meta.group)
        : chain.requireGroup(meta.group);
  }

  if (meta.condition) {
    chain = chain.mustBe(meta.condition);
  }

  if (meta.feature && meta.action) {
    chain = chain.require(meta.action).on(meta.feature);
  }

  return chain.allowed();
}
