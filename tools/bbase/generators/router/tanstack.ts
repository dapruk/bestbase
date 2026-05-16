import { join } from 'node:path';

import { writeProjectFile } from '../../utils/file-writer';

export interface RouterGeneratorOptions {
  dryRun?: boolean | undefined;
  force?: boolean | undefined;
}

export function generateTanStackRouter(options: RouterGeneratorOptions) {
  const files: string[] = [];
  const write = (path: string, content: string) => {
    if (writeProjectFile({ ...options, content, path }) === 'created') {
      files.push(path);
    }
  };

  write(
    join('src', 'router', 'index.ts'),
    `export { AppRouter } from './tanstack/router';\n`
  );
  write(
    join('src', 'router', 'router.types.ts'),
    `import type { AppGuardMeta } from '@/core/guard/guard.types';\n\nexport interface AppRouteMeta extends AppGuardMeta {\n  title?: string;\n}\n`
  );
  write(
    join('src', 'router', 'tanstack', 'route-meta.ts'),
    `import type { AppRouteMeta } from '@/router/router.types';\n\nexport function defineRouteMeta(meta: AppRouteMeta): AppRouteMeta {\n  return meta;\n}\n`
  );
  write(
    join('src', 'router', 'tanstack', 'guard-adapter.tsx'),
    tanstackGuardAdapter()
  );
  write(join('src', 'router', 'tanstack', 'router.tsx'), tanstackRouter());
  write(
    join('src', 'router', 'generated', 'index.ts'),
    `export const generatedRoutes = [] as const;\n`
  );

  return files;
}

function tanstackGuardAdapter() {
  return `import { Navigate } from '@tanstack/react-router';\nimport type { IGuardChain } from 'guardap';\n\nimport { useAuth } from '@/core/auth/use-auth';\nimport { resolveAppConfig } from '@/core/config/resolve-app-config';\nimport { Guard } from '@/core/guard/guard.config';\nimport type { AppAction, AppCondition, AppFeature, AppGroup, AppGuardMeta, AppRole, AppRoutePath } from '@/core/guard/guard.types';\nimport { LoadingState } from '@/shared/components/feedback/loading-state';\n\ninterface GuardedRouteProps {\n  children: React.ReactNode;\n  meta?: AppGuardMeta | undefined;\n}\n\nexport function GuardedRoute({ children, meta }: GuardedRouteProps) {\n  const auth = useAuth();\n  const config = resolveAppConfig();\n\n  if (meta?.public) return children;\n\n  if (auth.status === 'idle' || auth.status === 'checking') {\n    return <LoadingState title="Memeriksa sesi" />;\n  }\n\n  if (!evaluateRouteGuard(meta)) {\n    const isAuthenticated = auth.status === 'authenticated';\n    const fallbackPath = isAuthenticated\n      ? config.guard.forbiddenPath\n      : config.router.defaultPublicPath;\n\n    return <Navigate replace to={(meta?.redirectTo ?? fallbackPath) as '/login' | '/forbidden'} />;\n  }\n\n  return children;\n}\n\nfunction evaluateRouteGuard(meta?: AppGuardMeta) {\n  if (!meta) return Guard.requireLogin().allowed();\n\n  let chain: IGuardChain<AppRole, AppFeature, AppAction, AppCondition, AppGroup, unknown, AppRoutePath> = meta.login\n    ? Guard.requireLogin()\n    : Guard.with(undefined);\n\n  if (meta.guest) chain = chain.guestOnly();\n  if (meta.role) chain = typeof meta.role === 'string' ? chain.requireRole(meta.role) : chain.requireRole(meta.role);\n  if (meta.group) chain = typeof meta.group === 'string' ? chain.requireGroup(meta.group) : chain.requireGroup(meta.group);\n  if (meta.condition) chain = chain.mustBe(meta.condition);\n  if (meta.feature && meta.action) chain = chain.require(meta.action).on(meta.feature);\n\n  return chain.allowed();\n}\n`;
}

function tanstackRouter() {
  return `import { createRootRoute, createRoute, createRouter, RouterProvider, Outlet } from '@tanstack/react-router';\n\nimport { AppLayout } from '@/layouts/AppLayout';\nimport { DashboardPage } from '@/pages/dashboard/DashboardPage';\nimport { ForbiddenPage } from '@/pages/forbidden/ForbiddenPage';\nimport { LandingPage } from '@/pages/landing/LandingPage';\nimport { LoginPage } from '@/pages/login/LoginPage';\nimport { NotFoundPage } from '@/pages/not-found/NotFoundPage';\n\nimport { GuardedRoute } from './guard-adapter';\n\nconst rootRoute = createRootRoute({\n  component: () => (\n    <AppLayout>\n      <Outlet />\n    </AppLayout>\n  ),\n  notFoundComponent: NotFoundPage,\n});\n\nconst landingRoute = createRoute({\n  component: LandingPage,\n  getParentRoute: () => rootRoute,\n  path: '/',\n});\n\nconst loginRoute = createRoute({\n  component: () => (\n    <GuardedRoute meta={{ public: true }}>\n      <LoginPage />\n    </GuardedRoute>\n  ),\n  getParentRoute: () => rootRoute,\n  path: '/login',\n});\n\nconst dashboardRoute = createRoute({\n  component: () => (\n    <GuardedRoute meta={{ action: 'read', feature: 'dashboard', login: true }}>\n      <DashboardPage />\n    </GuardedRoute>\n  ),\n  getParentRoute: () => rootRoute,\n  path: '/dashboard',\n});\n\nconst forbiddenRoute = createRoute({\n  component: ForbiddenPage,\n  getParentRoute: () => rootRoute,\n  path: '/forbidden',\n});\n\nconst notFoundRoute = createRoute({\n  component: NotFoundPage,\n  getParentRoute: () => rootRoute,\n  path: '/not-found',\n});\n\nconst routeTree = rootRoute.addChildren([\n  landingRoute,\n  loginRoute,\n  dashboardRoute,\n  forbiddenRoute,\n  notFoundRoute,\n]);\n\nexport const router = createRouter({ routeTree });\n\nexport function AppRouter() {\n  return <RouterProvider router={router} />;\n}\n\ndeclare module '@tanstack/react-router' {\n  interface Register {\n    router: typeof router;\n  }\n}\n`;
}
