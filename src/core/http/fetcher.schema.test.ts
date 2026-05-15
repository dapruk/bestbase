import { afterEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { baseFetcher, buildQuery, configureFetcher } from './fetcher';
import type { SchemaValidationError } from './fetcher.errors';
import { ApiError } from './fetcher.errors';

describe('schema fetcher', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    configureFetcher({
      onForbidden: undefined,
      onUnauthorized: undefined,
    });
  });

  it('builds query strings without empty values', () => {
    expect(
      buildQuery({
        active: true,
        empty: '',
        page: 2,
        q: 'dashboard',
        skip: undefined,
      })
    ).toBe('?active=true&page=2&q=dashboard');
  });

  it('validates query, body, and response schemas', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ id: 'u1', name: 'Bestbase' }), {
        headers: { 'content-type': 'application/json' },
        status: 200,
      })
    );
    vi.stubGlobal('fetch', fetchMock);

    const result = await baseFetcher.request('/users', {
      body: { name: 'Bestbase' },
      bodySchema: z.object({ name: z.string().min(1) }),
      method: 'POST',
      params: { page: 1 },
      querySchema: z.object({ page: z.number().int() }),
      responseSchema: z.object({
        id: z.string(),
        name: z.string(),
      }),
    });

    expect(result).toEqual({ id: 'u1', name: 'Bestbase' });
    expect(fetchMock).toHaveBeenCalledWith(
      '/users?page=1',
      expect.objectContaining({
        body: JSON.stringify({ name: 'Bestbase' }),
        method: 'POST',
      })
    );
  });

  it('throws SchemaValidationError with readable first issue summary', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ id: 1 }), {
          headers: { 'content-type': 'application/json' },
          status: 200,
        })
      )
    );

    await expect(
      baseFetcher.request('/users/1', {
        debug: false,
        responseSchema: z.object({ id: z.string() }),
      })
    ).rejects.toMatchObject({
      firstIssueSummary: expect.stringContaining('id'),
      name: 'SchemaValidationError',
      rawData: { id: 1 },
      target: 'response',
    } satisfies Partial<SchemaValidationError>);
  });

  it('normalizes non-OK responses into ApiError and calls status hooks', async () => {
    const onUnauthorized = vi.fn();
    configureFetcher({ onUnauthorized });
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: 'Sesi habis' }), {
          headers: { 'content-type': 'application/json' },
          status: 401,
          statusText: 'Unauthorized',
        })
      )
    );

    await expect(baseFetcher.get('/me')).rejects.toBeInstanceOf(ApiError);
    expect(onUnauthorized).toHaveBeenCalledWith({
      data: { message: 'Sesi habis' },
      path: '/me',
      status: 401,
    });
  });

  it('handles 204 No Content safely', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(null, { status: 204 }))
    );

    await expect(
      baseFetcher.request('/users/1', { responseSchema: z.null() })
    ).resolves.toBeNull();
  });
});
