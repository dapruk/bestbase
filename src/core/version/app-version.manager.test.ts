import { beforeEach, describe, expect, it, vi } from 'vitest';

import { defaultAppConfig } from '@/core/config/default-app-config';

import type { AppConfig } from '../config/app-config.types';
import {
  checkAppVersion,
  handleAppVersion,
  resolveBundledAppVersion,
  watchAppVersion,
} from './app-version.manager';

function createConfig(overrides: Partial<AppConfig> = {}): AppConfig {
  return {
    ...defaultAppConfig,
    ...overrides,
    app: {
      ...defaultAppConfig.app,
      ...overrides.app,
    },
    state: {
      persistence: {
        ...defaultAppConfig.state.persistence,
        ...overrides.state?.persistence,
        redis: {
          ...defaultAppConfig.state.persistence.redis,
          ...overrides.state?.persistence?.redis,
        },
      },
    },
    versioning: {
      ...defaultAppConfig.versioning,
      ...overrides.versioning,
      cleanupHooks: {
        ...defaultAppConfig.versioning.cleanupHooks,
        ...overrides.versioning?.cleanupHooks,
      },
      reload: {
        ...defaultAppConfig.versioning.reload,
        ...overrides.versioning?.reload,
      },
      remote: {
        ...defaultAppConfig.versioning.remote,
        ...overrides.versioning?.remote,
      },
      watch: {
        ...defaultAppConfig.versioning.watch,
        ...overrides.versioning?.watch,
      },
    },
  };
}

describe('app version manager', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    window.localStorage.clear();
    window.sessionStorage.clear();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        href: 'http://localhost/dashboard',
        origin: 'http://localhost',
        replace: vi.fn(),
      },
    });
  });

  it('appends local suffix once in local development', () => {
    vi.stubEnv('DEV', true);
    vi.stubEnv('VITE_APP_VERSION', '');

    expect(resolveBundledAppVersion(createConfig())).toBe('0.1.0-local');
    expect(
      resolveBundledAppVersion(
        createConfig({
          app: {
            environment: 'development',
            name: 'Bestbase',
            version: '0.1.0-local',
          },
        })
      )
    ).toBe('0.1.0-local');
  });

  it('keeps production version without local suffix', () => {
    vi.stubEnv('DEV', false);
    vi.stubEnv('VITE_APP_VERSION', '');

    expect(
      resolveBundledAppVersion(
        createConfig({
          app: {
            environment: 'production',
            name: 'Bestbase',
            version: '0.1.0',
          },
        })
      )
    ).toBe('0.1.0');
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

    expect(result.status).toBe('saved-version-updated');
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

  it('reloads when remote version differs from bundled version', async () => {
    vi.stubEnv('DEV', false);
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        Response.json({
          version: '1.0.1',
        })
      )
    );
    window.localStorage.setItem('bestbase:app-version', '1.0.0');

    const result = await checkAppVersion(
      createConfig({
        app: {
          environment: 'production',
          name: 'Bestbase',
          version: '1.0.0',
        },
        versioning: {
          ...defaultAppConfig.versioning,
          remote: {
            ...defaultAppConfig.versioning.remote,
            enabled: true,
          },
        },
      })
    );

    expect(result).toBe('reload-started');
    expect(window.location.replace).toHaveBeenCalledWith(
      expect.stringContaining('__app_reload=')
    );
  });

  it('stops repeated reload loops', async () => {
    vi.stubEnv('DEV', false);
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        Response.json({
          version: '1.0.1',
        })
      )
    );
    window.localStorage.setItem('bestbase:app-version', '1.0.0');
    window.sessionStorage.setItem(
      defaultAppConfig.versioning.reload.sessionKey,
      '1'
    );

    const result = await checkAppVersion(
      createConfig({
        app: {
          environment: 'production',
          name: 'Bestbase',
          version: '1.0.0',
        },
        versioning: {
          ...defaultAppConfig.versioning,
          remote: {
            ...defaultAppConfig.versioning.remote,
            enabled: true,
          },
        },
      })
    );

    expect(result).toBe('reload-loop-stopped');
    expect(window.location.replace).not.toHaveBeenCalled();
  });

  it('registers and unregisters watch events', () => {
    const addEventListener = vi.fn();
    const removeEventListener = vi.fn();
    Object.assign(window, {
      addEventListener,
      removeEventListener,
    });

    const watcher = watchAppVersion(
      createConfig({
        versioning: {
          ...defaultAppConfig.versioning,
          watch: {
            enabled: true,
            events: ['focus', 'online'],
          },
        },
      })
    );
    watcher.stop();

    expect(addEventListener).toHaveBeenCalledTimes(2);
    expect(removeEventListener).toHaveBeenCalledTimes(2);
  });
});
