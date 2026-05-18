import type { AppVersionMode } from '@/core/config/app-config.types';

export type AppVersionCheckResult =
  | 'latest'
  | 'saved-version-updated'
  | 'reload-started'
  | 'skipped'
  | 'reload-loop-stopped';

export interface AppVersionOptions {
  currentVersion: string;
  enabled: boolean;
  mode: AppVersionMode;
  preserveLocalStorageKeys: string[];
  reloadOnChange: boolean;
  reload?: {
    queryKey: string;
    sessionKey: string;
    maxAttempts: number;
  };
  storageKey: string;
}

export interface AppVersionResult {
  changed: boolean;
  fromVersion: string | null;
  mode: AppVersionMode;
  reloaded: boolean;
  status: AppVersionCheckResult;
  toVersion: string;
}

export interface RemoteVersionPayload {
  buildTime?: string;
  generatedAt?: string;
  version: string;
}

export interface AppVersionWatcher {
  stop: () => void;
}
