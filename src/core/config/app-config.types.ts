export type AppEnvironment =
  | 'development'
  | 'test'
  | 'staging'
  | 'production'
  | string;

export type AppRouterMode = 'tanstack' | 'react-router';

export type AppAuthMode = 'cookie' | 'bearer' | 'hybrid';

export type AppVersionMode = 'low' | 'mild' | 'aggressive';

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
    defaultLoginPath: string;
    defaultAuthenticatedPath: string;
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
    pageSizeOptions: number[];
  };
  features: Record<string, boolean>;
}
