import { describe, expect, it, vi } from 'vitest';

import { createAuthStore } from './auth.store';
import type { AuthClient } from './auth.types';

describe('auth store', () => {
  it('transitions to authenticated after a valid session check', async () => {
    const client: AuthClient = {
      checkSession: vi.fn().mockResolvedValue({ user: { id: 'u1' } }),
      login: vi.fn(),
      logout: vi.fn(),
      refreshSession: vi.fn(),
    };
    const store = createAuthStore(client);

    await store.checkSession();

    expect(store.getSnapshot().status).toBe('authenticated');
    expect(store.getSnapshot().session?.user.id).toBe('u1');
  });

  it('supports login, logout, and expired refresh state', async () => {
    const client: AuthClient = {
      checkSession: vi.fn(),
      login: vi.fn().mockResolvedValue({ user: { id: 'u2' } }),
      logout: vi.fn().mockResolvedValue(undefined),
      refreshSession: vi.fn().mockResolvedValue(null),
    };
    const store = createAuthStore(client);

    await store.login({ email: 'dev@bestbase.local', password: 'secret' });
    expect(store.getSnapshot().status).toBe('authenticated');

    await store.refreshSession();
    expect(store.getSnapshot().status).toBe('expired');

    await store.logout();
    expect(store.getSnapshot().status).toBe('guest');
  });
});
