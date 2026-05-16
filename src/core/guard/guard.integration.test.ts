import { describe, expect, it } from 'vitest';

import { Guard, resolveAppPermissions } from './guard.config';

describe('guardap integration', () => {
  it('uses the configured guardap fluent API', () => {
    expect(Guard.requireLogin().allowed()).toBe(false);
  });

  it('maps app roles to guardap feature/action permissions', () => {
    expect(resolveAppPermissions(['viewer'])).toMatchObject({
      dashboard: 'r',
      products: 'r',
    });
    expect(resolveAppPermissions(['superadmin'])).toEqual({ '*': '*' });
  });
});
