import type { FetcherRetryOptions, HttpMethod } from './fetcher.types';

export function isRetryableMethod(method: HttpMethod): boolean {
  return method === 'GET' || method === 'DELETE';
}

export function isTransientStatus(status: number): boolean {
  return status === 408 || status === 429 || status >= 500;
}

export function waitForRetry(delayMs: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, delayMs));
}

export function normalizeRetryOptions(
  retry: FetcherRetryOptions | false | undefined,
  defaults: FetcherRetryOptions
): FetcherRetryOptions {
  if (retry === false) {
    return { attempts: 0, delayMs: 0 };
  }

  return retry ?? defaults;
}
