import { resolveAppConfig } from '@/core/config/resolve-app-config';

import { isAbsoluteUrl, joinUrl } from './url';

export interface CompleteImageUrlOptions {
  baseUrl?: string | undefined;
  fallbackImageUrl?: string | undefined;
}

export function completeImageUrl(
  src: string | null | undefined,
  options: CompleteImageUrlOptions = {}
) {
  const config = resolveAppConfig();
  const fallbackImageUrl =
    options.fallbackImageUrl ?? config.assets.fallbackImageUrl;
  const baseUrl = options.baseUrl ?? config.assets.imageBaseUrl;
  const value = src?.trim();

  if (!value) return fallbackImageUrl;
  if (isAbsoluteUrl(value)) return value;
  if (!baseUrl) return value.startsWith('/') ? value : `/${value}`;

  return joinUrl(baseUrl, value);
}
