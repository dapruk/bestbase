export type AppEnvironment =
  | 'development'
  | 'test'
  | 'staging'
  | 'production'
  | string;

export type AppRouterMode =
  | 'uninitialized'
  | 'tanstack'
  | 'react-router-framework';

export type AppRouterRenderingMode = 'spa' | 'server';

export type AppAuthMode = 'cookie' | 'bearer' | 'hybrid';

export type AppVersionMode = 'low' | 'mild' | 'aggressive';

export type AppVersionWatchEvent =
  | 'pageshow'
  | 'visibilitychange'
  | 'focus'
  | 'online';

export type AppVersionCleanupHook = () => void | Promise<void>;

export type StatePersistenceAdapterName =
  | 'localStorage'
  | 'sessionStorage'
  | 'redis'
  | 'memory';

export type AppFetcherStatusHook = (error: {
  data: unknown;
  path: string;
  status: number;
}) => void | Promise<void>;

export interface AppConfig {
  app: {
    name: string;
    version: string;
    environment: AppEnvironment;
  };
  router: {
    mode: AppRouterMode;
    rendering: AppRouterRenderingMode;
    defaultAuthenticatedPath: string;
    defaultPublicPath: string;
  };
  auth: {
    mode: AppAuthMode;
    endpoints: {
      session: string;
      login: string;
      logout: string;
      refresh: string;
    };
  };
  versioning: {
    enabled: boolean;
    storageKey: string;
    mode: AppVersionMode;
    reloadOnChange: boolean;
    preserveLocalStorageKeys: string[];
    localSuffix: string;
    remote: {
      enabled: boolean;
      url: string;
      cacheBustParam: string;
      timeoutMs: number;
    };
    reload: {
      queryKey: string;
      sessionKey: string;
      maxAttempts: number;
    };
    watch: {
      enabled: boolean;
      events: AppVersionWatchEvent[];
    };
    cleanupHooks?: {
      beforeReset?: AppVersionCleanupHook | undefined;
      afterReset?: AppVersionCleanupHook | undefined;
    };
  };
  runtime: {
    console: {
      suppressInProduction: boolean;
    };
  };
  pwa: {
    enabled: boolean;
    updateMode: 'disabled' | 'prompt' | 'auto';
    offlineFallback: boolean;
  };
  fetcher: {
    baseUrl: string;
    timeoutMs: number;
    retry: {
      attempts: number;
      delayMs: number;
    };
    credentials: RequestCredentials;
    onForbidden?: AppFetcherStatusHook | undefined;
    onUnauthorized?: AppFetcherStatusHook | undefined;
  };
  query: {
    staleTime: number;
    gcTime: number;
    retry: number | boolean;
    refetchOnWindowFocus: boolean;
  };
  guard: {
    enabled: boolean;
    forbiddenPath: string;
  };
  state: {
    persistence: {
      namespace: string;
      defaultAdapter: StatePersistenceAdapterName;
      debounceMs: number;
      redis: {
        enabled: boolean;
        endpoint: string;
      };
    };
  };
  ui: {
    breakpoints: {
      mobile: number;
    };
    defaultPageSize: number;
  };
  assets: {
    fallbackImageUrl: string;
    imageBaseUrl: string;
  };
  format: {
    currency: {
      currency: string;
      locale: string;
      maximumFractionDigits: number;
    };
  };
  dataTable: {
    debounceMs: number;
    defaultPageSize: number;
    enableUrlState: boolean;
    mode: 'server' | 'client';
    pageSizeOptions: number[];
  };
  features: Record<string, boolean>;
}
