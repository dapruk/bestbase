import appConfig from '../../../app.config';
import type { AppConfig } from './app-config.types';
import { defaultAppConfig } from './default-app-config';

let resolvedConfig: AppConfig | null = null;

export function resolveAppConfig(): AppConfig {
  if (resolvedConfig) {
    return resolvedConfig;
  }

  resolvedConfig = {
    ...defaultAppConfig,
    ...appConfig,
    app: { ...defaultAppConfig.app, ...appConfig.app },
    auth: {
      ...defaultAppConfig.auth,
      ...appConfig.auth,
      endpoints: {
        ...defaultAppConfig.auth.endpoints,
        ...appConfig.auth.endpoints,
      },
    },
    fetcher: {
      ...defaultAppConfig.fetcher,
      ...appConfig.fetcher,
      retry: {
        ...defaultAppConfig.fetcher.retry,
        ...appConfig.fetcher.retry,
      },
    },
    query: { ...defaultAppConfig.query, ...appConfig.query },
    router: { ...defaultAppConfig.router, ...appConfig.router },
    guard: { ...defaultAppConfig.guard, ...appConfig.guard },
    pwa: { ...defaultAppConfig.pwa, ...appConfig.pwa },
    state: {
      persistence: {
        ...defaultAppConfig.state.persistence,
        ...appConfig.state.persistence,
        redis: {
          ...defaultAppConfig.state.persistence.redis,
          ...appConfig.state.persistence.redis,
        },
      },
    },
    ui: { ...defaultAppConfig.ui, ...appConfig.ui },
    versioning: { ...defaultAppConfig.versioning, ...appConfig.versioning },
    features: { ...defaultAppConfig.features, ...appConfig.features },
  };

  return resolvedConfig;
}
