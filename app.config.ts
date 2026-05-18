import type { AppConfig } from '@/core/config/app-config.types';

const appConfig = {
  app: {
    name: 'Bestbase',
    version: '0.1.0',
    environment: import.meta.env.MODE,
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
    breakpoints: {
      mobile: 768,
    },
    defaultPageSize: 10,
  },
  assets: {
    imageBaseUrl: import.meta.env.VITE_IMAGE_BASE_URL ?? '',
    fallbackImageUrl: '/images/fallback-image.png',
  },
  format: {
    currency: {
      locale: 'id-ID',
      currency: 'IDR',
      maximumFractionDigits: 0,
    },
  },
  dataTable: {
    mode: 'server',
    defaultPageSize: 10,
    pageSizeOptions: [10, 20, 50, 100],
    enableUrlState: false,
    debounceMs: 300,
  },
  features: {},
} satisfies AppConfig;

export default appConfig;
