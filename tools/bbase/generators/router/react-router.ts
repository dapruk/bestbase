import { join } from 'node:path';

import { writeProjectFile } from '../../utils/file-writer';
import type { RouterGeneratorOptions } from './tanstack';

export function generateReactRouter(options: RouterGeneratorOptions) {
  const files: string[] = [];
  const write = (path: string, content: string) => {
    if (writeProjectFile({ ...options, content, path }) === 'created') {
      files.push(path);
    }
  };

  write(
    join('src', 'router', 'index.ts'),
    `export { AppRouter } from './react-router/router';\n`
  );
  write(
    join('src', 'router', 'router.types.ts'),
    `import type { AppGuardMeta } from '@/core/guard/guard.types';\n\nexport interface AppRouteMeta extends AppGuardMeta {\n  title?: string;\n}\n`
  );
  write(
    join('src', 'router', 'react-router', 'route-meta.ts'),
    `import type { AppRouteMeta } from '@/router/router.types';\n\nexport function defineRouteMeta(meta: AppRouteMeta): AppRouteMeta {\n  return meta;\n}\n`
  );
  write(
    join('src', 'router', 'react-router', 'guard-adapter.tsx'),
    reactRouterGuardAdapter()
  );
  write(join('src', 'router', 'react-router', 'routes.tsx'), reactRoutes());
  write(join('src', 'router', 'react-router', 'router.tsx'), reactRouter());
  write(
    join('src', 'router', 'generated', 'index.ts'),
    `export const generatedRoutes = [] as const;\n`
  );

  return files;
}

function reactRouterGuardAdapter() {
  return `import { Navigate } from 'react-router';\nimport type { IGuardChain } from 'guardap';\n\nimport { useAuth } from '@/core/auth/use-auth';\nimport { resolveAppConfig } from '@/core/config/resolve-app-config';\nimport { Guard } from '@/core/guard/guard.config';\nimport type { AppAction, AppCondition, AppFeature, AppGroup, AppGuardMeta, AppRole, AppRoutePath } from '@/core/guard/guard.types';\nimport { LoadingState } from '@/shared/components/feedback/loading-state';\n\ninterface GuardedRouteProps {\n  children: React.ReactNode;\n  meta?: AppGuardMeta | undefined;\n}\n\nexport function GuardedRoute({ children, meta }: GuardedRouteProps) {\n  const auth = useAuth();\n  const config = resolveAppConfig();\n\n  if (meta?.public) return children;\n\n  if (auth.status === 'idle' || auth.status === 'checking') {\n    return <LoadingState title="Memeriksa sesi" />;\n  }\n\n  if (!evaluateRouteGuard(meta)) {\n    const isAuthenticated = auth.status === 'authenticated';\n    const fallbackPath = isAuthenticated\n      ? config.guard.forbiddenPath\n      : config.router.defaultPublicPath;\n\n    return <Navigate replace to={meta?.redirectTo ?? fallbackPath} />;\n  }\n\n  return children;\n}\n\nfunction evaluateRouteGuard(meta?: AppGuardMeta) {\n  if (!meta) return Guard.requireLogin().allowed();\n\n  let chain: IGuardChain<AppRole, AppFeature, AppAction, AppCondition, AppGroup, unknown, AppRoutePath> = meta.login\n    ? Guard.requireLogin()\n    : Guard.with(undefined);\n\n  if (meta.guest) chain = chain.guestOnly();\n  if (meta.role) chain = typeof meta.role === 'string' ? chain.requireRole(meta.role) : chain.requireRole(meta.role);\n  if (meta.group) chain = typeof meta.group === 'string' ? chain.requireGroup(meta.group) : chain.requireGroup(meta.group);\n  if (meta.condition) chain = chain.mustBe(meta.condition);\n  if (meta.feature && meta.action) chain = chain.require(meta.action).on(meta.feature);\n\n  return chain.allowed();\n}\n`;
}

function reactRoutes() {
  return `import { Outlet, type RouteObject } from 'react-router';\n\nimport { AppLayout } from '@/layouts/AppLayout';\nimport { DashboardPage } from '@/pages/dashboard/DashboardPage';\nimport { ForbiddenPage } from '@/pages/forbidden/ForbiddenPage';\nimport { LandingPage } from '@/pages/landing/LandingPage';\nimport { LoginPage } from '@/pages/login/LoginPage';\nimport { NotFoundPage } from '@/pages/not-found/NotFoundPage';\n\nimport { GuardedRoute } from './guard-adapter';\n\nexport const routes: RouteObject[] = [\n  {\n    path: '/',\n    element: (\n      <AppLayout>\n        <Outlet />\n      </AppLayout>\n    ),\n    errorElement: <NotFoundPage />,\n    children: [\n      { index: true, element: <LandingPage /> },\n      {\n        path: 'login',\n        element: (\n          <GuardedRoute meta={{ public: true }}>\n            <LoginPage />\n          </GuardedRoute>\n        ),\n      },\n      {\n        path: 'dashboard',\n        element: (\n          <GuardedRoute meta={{ action: 'read', feature: 'dashboard', login: true }}>\n            <DashboardPage />\n          </GuardedRoute>\n        ),\n      },\n      { path: 'forbidden', element: <ForbiddenPage /> },\n      { path: 'not-found', element: <NotFoundPage /> },\n      { path: '*', element: <NotFoundPage /> },\n    ],\n  },\n];\n`;
}

function reactRouter() {
  return `import { createBrowserRouter, RouterProvider } from 'react-router';\n\nimport { routes } from './routes';\n\nexport const router = createBrowserRouter(routes);\n\nexport function AppRouter() {\n  return <RouterProvider router={router} />;\n}\n`;
}
