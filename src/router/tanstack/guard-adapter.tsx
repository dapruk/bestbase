import { RouteGuard } from '@/core/guard/RouteGuard';
import type { AppRouteMeta } from '@/router/router.types';

interface GuardedRouteProps {
  children: React.ReactNode;
  meta?: AppRouteMeta | undefined;
}

export function GuardedRoute({ children, meta }: GuardedRouteProps) {
  return <RouteGuard meta={meta}>{children}</RouteGuard>;
}
