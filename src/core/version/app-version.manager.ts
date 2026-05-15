import { resolveAppConfig } from '@/core/config/resolve-app-config';

import type { AppVersionOptions, AppVersionResult } from './app-version.types';
import {
  clearAppScopedLocalStorage,
  clearCacheStorage,
  clearLocalStorage,
  clearSessionStorage,
} from './cache-cleaner';

export async function handleAppVersion(
  options: AppVersionOptions
): Promise<AppVersionResult> {
  const previousVersion = window.localStorage.getItem(options.storageKey);

  if (
    !options.enabled ||
    previousVersion === null ||
    previousVersion === options.currentVersion
  ) {
    if (!previousVersion) {
      window.localStorage.setItem(options.storageKey, options.currentVersion);
    }

    return {
      changed: false,
      fromVersion: previousVersion,
      mode: options.mode,
      reloaded: false,
      toVersion: options.currentVersion,
    };
  }

  window.localStorage.setItem(options.storageKey, options.currentVersion);

  if (options.mode === 'mild') {
    clearSessionStorage();
  }

  if (options.mode === 'aggressive') {
    clearSessionStorage();
    clearLocalStorage({
      preserveLocalStorageKeys: [
        ...options.preserveLocalStorageKeys,
        options.storageKey,
      ],
    });
    clearAppScopedLocalStorage(resolveAppConfig().state.persistence.namespace);
    await clearCacheStorage();
  }

  if (options.reloadOnChange) {
    window.location.reload();
  }

  return {
    changed: true,
    fromVersion: previousVersion,
    mode: options.mode,
    reloaded: options.reloadOnChange,
    toVersion: options.currentVersion,
  };
}

export async function initializeAppVersion(): Promise<AppVersionResult> {
  const config = resolveAppConfig();

  return handleAppVersion({
    currentVersion: config.app.version,
    enabled: config.versioning.enabled,
    mode: config.versioning.mode,
    preserveLocalStorageKeys: config.versioning.preserveLocalStorageKeys,
    reloadOnChange: config.versioning.reloadOnChange,
    storageKey: config.versioning.storageKey,
  });
}
