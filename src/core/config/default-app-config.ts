import type { AppConfig } from './app-config.types';

export const defaultAppConfig: AppConfig = {
  app: {
    name: 'Bestbase',
    version: '0.1.0',
    environment: 'development',
  },
  router: {
    mode: 'uninitialized',
    rendering: 'spa',
    defaultAuthenticatedPath: '/dashboard',
    defaultPublicPath: '/login',
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
    localSuffix: '-local',
    remote: {
      enabled: false,
      url: '/version.json',
      cacheBustParam: 't',
      timeoutMs: 5000,
    },
    reload: {
      queryKey: '__app_reload',
      sessionKey: 'bestbase:app-version-reload-attempt',
      maxAttempts: 1,
    },
    watch: {
      enabled: true,
      events: ['pageshow', 'visibilitychange', 'focus', 'online'],
    },
  },
  runtime: {
    console: {
      suppressInProduction: true,
    },
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
    mode: 'server',
    pageSizeOptions: [10, 20, 50, 100],
  },
  features: {},
};
