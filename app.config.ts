import type { AppConfig } from '@/core/config/app-config.types';

const appConfig = {
  app: {
    name: 'Bestbase',
    version: '0.1.0',
    environment: import.meta.env.MODE,
  },
  router: {
    mode: 'tanstack',
    defaultLoginPath: '/login',
    defaultAuthenticatedPath: '/dashboard',
  },
  auth: {
    mode: 'cookie',
    endpoints: {
      session: '/auth/session',
      login: '/auth/login',
      logout: '/auth/logout',
      refresh: '/auth/refresh',
    },
  },
  versioning: {
    enabled: true,
    storageKey: 'bestbase:app-version',
    mode: 'mild',
    reloadOnChange: false,
    preserveLocalStorageKeys: ['bestbase:app-version'],
  },
  pwa: {
    enabled: false,
    updateMode: 'prompt',
    offlineFallback: false,
  },
  fetcher: {
    baseUrl: import.meta.env.VITE_API_BASE_URL ?? '',
    timeoutMs: 15000,
    retry: {
      attempts: 2,
      delayMs: 300,
    },
    credentials: 'include',
  },
  query: {
    staleTime: 30000,
    gcTime: 300000,
    retry: 1,
    refetchOnWindowFocus: false,
  },
  guard: {
    enabled: true,
    forbiddenPath: '/forbidden',
  },
  state: {
    persistence: {
      namespace: 'bestbase',
      defaultAdapter: 'localStorage',
      debounceMs: 250,
      redis: {
        enabled: false,
        endpoint: '/state/persistence',
      },
    },
  },
  ui: {
    defaultPageSize: 10,
  },
  features: {},
} satisfies AppConfig;

export default appConfig;
