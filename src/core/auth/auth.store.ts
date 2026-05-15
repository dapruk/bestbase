import { createStore } from '@/core/rx/create-store';

import type { AuthClient, AuthState, LoginInput } from './auth.types';

export const initialAuthState: AuthState = {
  error: null,
  redirectTo: null,
  session: null,
  status: 'idle',
};

export function createAuthStore(client: AuthClient) {
  const store = createStore<AuthState>(initialAuthState);

  return {
    ...store,
    async checkSession() {
      store.patchState({ error: null, status: 'checking' });

      try {
        const session = await client.checkSession();
        store.patchState({
          session,
          status: session ? 'authenticated' : 'guest',
        });
      } catch (error) {
        store.patchState({
          error:
            error instanceof Error ? error.message : 'Session check failed',
          session: null,
          status: 'guest',
        });
      }
    },
    async login(input: LoginInput) {
      store.patchState({ error: null, status: 'checking' });

      try {
        const session = await client.login(input);
        store.patchState({ session, status: 'authenticated' });
      } catch (error) {
        store.patchState({
          error: error instanceof Error ? error.message : 'Login failed',
          session: null,
          status: 'error',
        });
      }
    },
    async logout() {
      await client.logout();
      store.patchState({
        error: null,
        redirectTo: null,
        session: null,
        status: 'guest',
      });
    },
    async refreshSession() {
      store.patchState({ error: null, status: 'refreshing' });

      try {
        const session = await client.refreshSession();
        store.patchState({
          session,
          status: session ? 'authenticated' : 'expired',
        });
      } catch (error) {
        store.patchState({
          error: error instanceof Error ? error.message : 'Refresh failed',
          session: null,
          status: 'expired',
        });
      }
    },
    setRedirectIntent(redirectTo: string | null) {
      store.patchState({ redirectTo });
    },
  };
}

export type AuthStore = ReturnType<typeof createAuthStore>;
