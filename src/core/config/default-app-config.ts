import type { AppConfig } from './app-config.types';

export const defaultAppConfig: AppConfig = {
  app: {
    name: 'Bestbase',
    version: '0.1.0',
    environment: 'development',
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
    baseUrl: '',
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
    breakpoints: {
      mobile: 768,
    },
    defaultPageSize: 10,
  },
  assets: {
    fallbackImageUrl: '/images/fallback-image.png',
    imageBaseUrl: '',
  },
  format: {
    currency: {
      currency: 'IDR',
      locale: 'id-ID',
      maximumFractionDigits: 0,
    },
  },
  dataTable: {
    debounceMs: 300,
    defaultPageSize: 10,
    enableUrlState: false,
    pageSizeOptions: [10, 20, 50, 100],
  },
  features: {},
};
