import { resolveAppConfig } from '@/core/config/resolve-app-config';
import { baseFetcher } from '@/core/http/fetcher';

import type { AuthClient, AuthSession, LoginInput } from './auth.types';

export function createAuthClient(): AuthClient {
  const config = resolveAppConfig();
  const endpoints = config.auth.endpoints;

  return {
    async checkSession() {
      return baseFetcher.get<AuthSession | null>(endpoints.session, {
        retry: false,
      });
    },
    async login(input: LoginInput) {
      return baseFetcher.post<AuthSession, LoginInput>(endpoints.login, input, {
        retry: false,
      });
    },
    async logout() {
      await baseFetcher.post(endpoints.logout, undefined, { retry: false });
    },
    async refreshSession() {
      return baseFetcher.post<AuthSession | null>(
        endpoints.refresh,
        undefined,
        {
          retry: false,
        }
      );
    },
  };
}
