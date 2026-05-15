import type { AppVersionMode } from '@/core/config/app-config.types';

export interface AppVersionOptions {
  currentVersion: string;
  enabled: boolean;
  mode: AppVersionMode;
  preserveLocalStorageKeys: string[];
  reloadOnChange: boolean;
  storageKey: string;
}

export interface AppVersionResult {
  changed: boolean;
  fromVersion: string | null;
  mode: AppVersionMode;
  reloaded: boolean;
  toVersion: string;
}
