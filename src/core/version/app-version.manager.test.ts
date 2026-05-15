import { beforeEach, describe, expect, it, vi } from 'vitest';

import { handleAppVersion } from './app-version.manager';

describe('app version manager', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  it('stores version on first run without cleanup', async () => {
    const result = await handleAppVersion({
      currentVersion: '1.0.0',
      enabled: true,
      mode: 'low',
      preserveLocalStorageKeys: [],
      reloadOnChange: false,
      storageKey: 'version',
    });

    expect(result.changed).toBe(false);
    expect(window.localStorage.getItem('version')).toBe('1.0.0');
  });

  it('clears session storage on mild updates', async () => {
    window.localStorage.setItem('version', '1.0.0');
    window.sessionStorage.setItem('draft', 'yes');

    await handleAppVersion({
      currentVersion: '1.0.1',
      enabled: true,
      mode: 'mild',
      preserveLocalStorageKeys: [],
      reloadOnChange: false,
      storageKey: 'version',
    });

    expect(window.sessionStorage.getItem('draft')).toBeNull();
  });

  it('can request a reload when configured', async () => {
    const reload = vi.fn();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { reload },
    });
    window.localStorage.setItem('version', '1.0.0');

    await handleAppVersion({
      currentVersion: '1.0.1',
      enabled: true,
      mode: 'low',
      preserveLocalStorageKeys: [],
      reloadOnChange: true,
      storageKey: 'version',
    });

    expect(reload).toHaveBeenCalled();
  });
});
