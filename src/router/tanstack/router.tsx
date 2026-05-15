import {
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';

import { AppLayout } from '@/layouts/AppLayout';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { ForbiddenPage } from '@/pages/forbidden/ForbiddenPage';
import { LandingPage } from '@/pages/landing/LandingPage';
import { LoginPage } from '@/pages/login/LoginPage';
import { NotFoundPage } from '@/pages/not-found/NotFoundPage';

import { GuardedRoute } from './guard-adapter';

const rootRoute = createRootRoute({
  component: AppLayout,
  notFoundComponent: NotFoundPage,
});

const landingRoute = createRoute({
  component: LandingPage,
  getParentRoute: () => rootRoute,
  path: '/',
});

const loginRoute = createRoute({
  component: () => (
    <GuardedRoute meta={{ public: true }}>
      <LoginPage />
    </GuardedRoute>
  ),
  getParentRoute: () => rootRoute,
  path: '/login',
});

const dashboardRoute = createRoute({
  component: () => (
    <GuardedRoute meta={{ action: 'read', feature: 'dashboard', login: true }}>
      <DashboardPage />
    </GuardedRoute>
  ),
  getParentRoute: () => rootRoute,
  path: '/dashboard',
});

const forbiddenRoute = createRoute({
  component: ForbiddenPage,
  getParentRoute: () => rootRoute,
  path: '/forbidden',
});

const notFoundRoute = createRoute({
  component: NotFoundPage,
  getParentRoute: () => rootRoute,
  path: '/not-found',
});

const routeTree = rootRoute.addChildren([
  landingRoute,
  loginRoute,
  dashboardRoute,
  forbiddenRoute,
  notFoundRoute,
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
