import { resolveAppConfig } from '@/core/config/resolve-app-config';

import type { AppConfig } from '../config/app-config.types';
import type {
  AppVersionCheckResult,
  AppVersionOptions,
  AppVersionResult,
  AppVersionWatcher,
  RemoteVersionPayload,
} from './app-version.types';
import {
  clearAppScopedLocalStorage,
  clearCacheStorage,
  clearLocalStorage,
  clearSessionStorage,
} from './cache-cleaner';

let versionCheckPromise: Promise<AppVersionCheckResult> | null = null;

function getImportMetaEnv() {
  return import.meta.env;
}

function isLocalRuntime(config: AppConfig): boolean {
  const env = getImportMetaEnv();

  return Boolean(env.DEV) || config.app.environment === 'development';
}

function appendLocalSuffix(version: string, suffix: string): string {
  if (!suffix || version.endsWith(suffix)) {
    return version;
  }

  return `${version}${suffix}`;
}

export function resolveBundledAppVersion(config = resolveAppConfig()): string {
  const envVersion = getImportMetaEnv().VITE_APP_VERSION;
  const version = envVersion || config.app.version;

  if (isLocalRuntime(config)) {
    return appendLocalSuffix(version, config.versioning.localSuffix);
  }

  return version;
}

async function fetchRemoteVersion(
  config: AppConfig
): Promise<RemoteVersionPayload | null> {
  if (!config.versioning.remote.enabled) {
    return null;
  }

  const url = new URL(config.versioning.remote.url, window.location.origin);
  url.searchParams.set(
    config.versioning.remote.cacheBustParam,
    Date.now().toString()
  );

  const controller = new AbortController();
  const timeout = window.setTimeout(() => {
    controller.abort();
  }, config.versioning.remote.timeoutMs);

  try {
    const response = await fetch(url.toString(), {
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
        'Cache-Control': 'no-cache',
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      return null;
    }

    const data: unknown = await response.json();

    if (
      data &&
      typeof data === 'object' &&
      'version' in data &&
      typeof data.version === 'string'
    ) {
      return data as RemoteVersionPayload;
    }

    return null;
  } catch {
    return null;
  } finally {
    window.clearTimeout(timeout);
  }
}

function hasReloadLoopStopped(config: AppConfig): boolean {
  const currentAttempts = Number(
    window.sessionStorage.getItem(config.versioning.reload.sessionKey) ?? '0'
  );

  return currentAttempts >= config.versioning.reload.maxAttempts;
}

function markReloadAttempt(config: AppConfig): void {
  const currentAttempts = Number(
    window.sessionStorage.getItem(config.versioning.reload.sessionKey) ?? '0'
  );

  window.sessionStorage.setItem(
    config.versioning.reload.sessionKey,
    String(currentAttempts + 1)
  );
}

function clearReloadLoopState(config: AppConfig): void {
  window.sessionStorage.removeItem(config.versioning.reload.sessionKey);
}

function startReload(config: AppConfig): AppVersionCheckResult {
  if (hasReloadLoopStopped(config)) {
    return 'reload-loop-stopped';
  }

  markReloadAttempt(config);

  const url = new URL(window.location.href);
  url.searchParams.set(
    config.versioning.reload.queryKey,
    Date.now().toString()
  );

  if (typeof window.location.replace === 'function') {
    window.location.replace(url.toString());
  } else {
    window.location.href = url.toString();
  }

  return 'reload-started';
}

export async function clearBrowserCache(): Promise<void> {
  await clearCacheStorage();
}

export async function resetApp(config = resolveAppConfig()): Promise<void> {
  await config.versioning.cleanupHooks?.beforeReset?.();

  if (config.versioning.mode === 'mild') {
    clearSessionStorage();
  }

  if (config.versioning.mode === 'aggressive') {
    clearSessionStorage();
    clearLocalStorage({
      preserveLocalStorageKeys: [
        ...config.versioning.preserveLocalStorageKeys,
        config.versioning.storageKey,
      ],
    });
    clearAppScopedLocalStorage(config.state.persistence.namespace);
    await clearBrowserCache();
  }

  await config.versioning.cleanupHooks?.afterReset?.();
}

export async function checkAppVersion(
  config = resolveAppConfig()
): Promise<AppVersionCheckResult> {
  if (!config.versioning.enabled) {
    return 'skipped';
  }

  const bundledVersion = resolveBundledAppVersion(config);
  const remoteVersion = await fetchRemoteVersion(config);
  const targetVersion = remoteVersion?.version ?? bundledVersion;
  const savedVersion = window.localStorage.getItem(
    config.versioning.storageKey
  );

  if (!savedVersion) {
    window.localStorage.setItem(config.versioning.storageKey, targetVersion);
    clearReloadLoopState(config);

    return 'saved-version-updated';
  }

  if (savedVersion === targetVersion && targetVersion === bundledVersion) {
    clearReloadLoopState(config);

    return 'latest';
  }

  const shouldReload =
    config.versioning.reloadOnChange || targetVersion !== bundledVersion;

  if (shouldReload && hasReloadLoopStopped(config)) {
    return 'reload-loop-stopped';
  }

  window.localStorage.setItem(config.versioning.storageKey, targetVersion);
  await resetApp(config);

  if (shouldReload) {
    return startReload(config);
  }

  clearReloadLoopState(config);

  return 'saved-version-updated';
}

export async function checkAppVersionOnce(
  config = resolveAppConfig()
): Promise<AppVersionCheckResult> {
  versionCheckPromise ??= checkAppVersion(config).finally(() => {
    versionCheckPromise = null;
  });

  return versionCheckPromise;
}

export function watchAppVersion(
  config = resolveAppConfig()
): AppVersionWatcher {
  if (!config.versioning.enabled || !config.versioning.watch.enabled) {
    return { stop: () => undefined };
  }

  const runCheck = () => {
    void checkAppVersion(config);
  };
  const handlers = config.versioning.watch.events.map((eventName) => {
    const handler = () => {
      if (
        eventName === 'visibilitychange' &&
        typeof document !== 'undefined' &&
        document.visibilityState !== 'visible'
      ) {
        return;
      }

      runCheck();
    };

    window.addEventListener(eventName, handler);

    return { eventName, handler };
  });

  return {
    stop: () => {
      handlers.forEach(({ eventName, handler }) => {
        window.removeEventListener(eventName, handler);
      });
    },
  };
}

export async function handleAppVersion(
  options: AppVersionOptions
): Promise<AppVersionResult> {
  const config = resolveAppConfig();
  const nextConfig: AppConfig = {
    ...config,
    versioning: {
      ...config.versioning,
      enabled: options.enabled,
      mode: options.mode,
      preserveLocalStorageKeys: options.preserveLocalStorageKeys,
      reload: options.reload ?? config.versioning.reload,
      reloadOnChange: options.reloadOnChange,
      remote: {
        ...config.versioning.remote,
        enabled: false,
      },
      storageKey: options.storageKey,
    },
  };
  const previousVersion = window.localStorage.getItem(options.storageKey);

  if (!previousVersion) {
    window.localStorage.setItem(options.storageKey, options.currentVersion);

    return {
      changed: false,
      fromVersion: previousVersion,
      mode: options.mode,
      reloaded: false,
      status: 'saved-version-updated',
      toVersion: options.currentVersion,
    };
  }

  if (!options.enabled || previousVersion === options.currentVersion) {
    return {
      changed: false,
      fromVersion: previousVersion,
      mode: options.mode,
      reloaded: false,
      status: options.enabled ? 'latest' : 'skipped',
      toVersion: options.currentVersion,
    };
  }

  if (options.reloadOnChange && hasReloadLoopStopped(nextConfig)) {
    return {
      changed: true,
      fromVersion: previousVersion,
      mode: options.mode,
      reloaded: false,
      status: 'reload-loop-stopped',
      toVersion: options.currentVersion,
    };
  }

  window.localStorage.setItem(options.storageKey, options.currentVersion);
  await resetApp(nextConfig);

  const status = options.reloadOnChange
    ? startReload(nextConfig)
    : 'saved-version-updated';

  return {
    changed: true,
    fromVersion: previousVersion,
    mode: options.mode,
    reloaded: status === 'reload-started',
    status,
    toVersion: options.currentVersion,
  };
}

export async function initializeAppVersion(): Promise<AppVersionCheckResult> {
  return checkAppVersionOnce(resolveAppConfig());
}
