import { evaluateGuardMeta } from 'guardap';
import { describe, expect, it } from 'vitest';

import { createAppGuard } from './guard.config';

describe('guardap integration', () => {
  it('uses guardap metadata evaluation for login checks', () => {
    const guard = createAppGuard({
      getPermissions: () => ({}),
    });

    expect(
      evaluateGuardMeta(
        guard,
        { login: true },
        { isAuthenticated: false, roles: [] }
      )
    ).toBe(false);
    expect(
      evaluateGuardMeta(
        guard,
        { login: true },
        { isAuthenticated: true, roles: ['user'] }
      )
    ).toBe(true);
  });

  it('uses guardap permission checks from configured permissions', () => {
    const guard = createAppGuard({
      getPermissions: (roles) => {
        if (roles.includes('admin')) return { '*': '*' };
        if (roles.includes('viewer')) return { dashboard: 'r' };
        return {};
      },
    });

    expect(
      evaluateGuardMeta(
        guard,
        { action: 'read', feature: 'dashboard' },
        { isAuthenticated: true, roles: ['viewer'] }
      )
    ).toBe(true);
    expect(
      evaluateGuardMeta(
        guard,
        { action: 'delete', feature: 'dashboard' },
        { isAuthenticated: true, roles: ['viewer'] }
      )
    ).toBe(false);
  });
});
