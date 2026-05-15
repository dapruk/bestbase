import type { z } from 'zod';

import { resolveAppConfig } from '@/core/config/resolve-app-config';

import { resolveAuthHeaders } from './fetcher.auth-middleware';
import {
  ApiError,
  SchemaValidationError,
  type SchemaValidationTarget,
} from './fetcher.errors';
import {
  isRetryableMethod,
  isTransientStatus,
  normalizeRetryOptions,
  waitForRetry,
} from './fetcher.retry';
import { withTimeout } from './fetcher.timeout';
import type {
  FetcherClient,
  FetcherOptions,
  FetcherRetryOptions,
  FetcherRuntimeConfig,
  HttpMethod,
  QueryParams,
} from './fetcher.types';

let fetcherRuntimeConfig: FetcherRuntimeConfig = {};

export function configureFetcher(config: FetcherRuntimeConfig) {
  fetcherRuntimeConfig = { ...fetcherRuntimeConfig, ...config };
}

export function buildQuery(queryParams: QueryParams = {}): string {
  const urlSearchParams = new URLSearchParams();

  Object.entries(queryParams).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }

    urlSearchParams.set(key, String(value));
  });

  const queryString = urlSearchParams.toString();
  return queryString ? `?${queryString}` : '';
}

function pathToString(pathSegments: ReadonlyArray<PropertyKey>): string {
  const asText = pathSegments
    .map((segment) => {
      if (typeof segment === 'number') {
        return `[${segment}]`;
      }

      return `.${String(segment)}`;
    })
    .join('');

  return asText.replace(/^\./, '') || '(root)';
}

function valueAtPath(
  rootValue: unknown,
  pathSegments: ReadonlyArray<PropertyKey>
): unknown {
  try {
    return pathSegments.reduce<unknown>((current, segment) => {
      if (current && typeof current === 'object') {
        return Reflect.get(current, segment);
      }

      return undefined;
    }, rootValue);
  } catch {
    return undefined;
  }
}

export function firstIssueSummary(
  rawData: unknown,
  zodError: z.ZodError
): string {
  const firstIssue = zodError.issues[0];

  if (!firstIssue) {
    return '[unknown] (root) -> Validation failed; value: undefined';
  }

  const issuePath = pathToString(firstIssue.path);
  const offendingValue = valueAtPath(rawData, firstIssue.path);

  return `[${firstIssue.code}] ${issuePath} -> ${firstIssue.message}; value: ${JSON.stringify(
    offendingValue
  )}`;
}

function isDevMode(): boolean {
  return Boolean(import.meta.env.DEV);
}

function validateWithSchema<TSchema extends z.ZodType>(
  schema: TSchema,
  rawData: unknown,
  target: SchemaValidationTarget,
  options: {
    debug?: boolean | undefined;
    label?: string | undefined;
  }
): z.infer<TSchema> {
  const parseResult = schema.safeParse(rawData);

  if (parseResult.success) {
    return parseResult.data;
  }

  const summary = firstIssueSummary(rawData, parseResult.error);
  const debugEnabled = options.debug ?? isDevMode();

  if (debugEnabled) {
    console.error(`Zod failed (${options.label ?? target}):`, summary);
  }

  throw new SchemaValidationError({
    firstIssueSummary: summary,
    issues: parseResult.error.issues,
    rawData,
    target,
  });
}

function normalizeQueryParams<TQuerySchema extends z.ZodType | undefined>(
  params: QueryParams | undefined,
  schema: TQuerySchema,
  options: {
    debug?: boolean | undefined;
    label?: string | undefined;
  }
): QueryParams {
  if (!schema) {
    return params ?? {};
  }

  const queryData = validateWithSchema(schema, params ?? {}, 'query', {
    debug: options.debug,
    label: options.label,
  });

  return Object.entries(
    queryData as Record<string, unknown>
  ).reduce<QueryParams>((query, [key, value]) => {
    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean' ||
      value === null ||
      value === undefined
    ) {
      query[key] = value;
    }

    return query;
  }, {});
}

function buildUrl(path: string, baseUrl: string, params?: QueryParams): string {
  const url = new URL(path, baseUrl || window.location.origin);
  const query = buildQuery(params);

  if (query) {
    const queryParams = new URLSearchParams(query.slice(1));
    queryParams.forEach((value, key) => url.searchParams.set(key, value));
  }

  if (!baseUrl && path.startsWith('/')) {
    return `${url.pathname}${url.search}${url.hash}`;
  }

  return url.toString();
}

async function parseResponse(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type') ?? '';
  const text = await response.text();

  if (!text) {
    return null;
  }

  if (contentType.includes('application/json')) {
    return JSON.parse(text) as unknown;
  }

  return text;
}

function messageFromErrorBody(
  errorBody: unknown,
  status: number,
  statusText: string
): string {
  if (typeof errorBody === 'string' && errorBody) {
    return errorBody;
  }

  if (
    errorBody &&
    typeof errorBody === 'object' &&
    'message' in errorBody &&
    typeof errorBody.message === 'string'
  ) {
    return errorBody.message;
  }

  return statusText || `Request failed with ${status}`;
}

async function runStatusHooks(
  status: number,
  path: string,
  data: unknown
): Promise<void> {
  if (status === 401) {
    await fetcherRuntimeConfig.onUnauthorized?.({ data, path, status });
  }

  if (status === 403) {
    await fetcherRuntimeConfig.onForbidden?.({ data, path, status });
  }
}

async function requestOnce<
  TResponse,
  TBody,
  TResponseSchema extends z.ZodType | undefined = undefined,
  TQuerySchema extends z.ZodType | undefined = undefined,
  TBodySchema extends z.ZodType | undefined = undefined,
>(
  path: string,
  options: FetcherOptions<TBody, TResponseSchema, TQuerySchema, TBodySchema>,
  authHeaders?: HeadersInit
): Promise<TResponse> {
  const config = resolveAppConfig();
  const method = options.method ?? 'GET';
  const timeout = withTimeout(options.timeoutMs ?? config.fetcher.timeoutMs);
  const headers = new Headers({
    Accept: 'application/json',
    ...authHeaders,
    ...options.headers,
  });

  let body: BodyInit | undefined;
  const bodySchema = options.bodySchema ?? options.requestSchema;
  const params = normalizeQueryParams(
    options.params,
    options.querySchema,
    options
  );

  if (options.body !== undefined) {
    const requestBody = bodySchema
      ? validateWithSchema(bodySchema, options.body, 'body', {
          debug: options.debug,
          label: options.label,
        })
      : options.body;

    headers.set('Content-Type', 'application/json');
    body = JSON.stringify(requestBody);
  }

  try {
    const {
      baseUrl: _baseUrl,
      body: _body,
      bodySchema: _bodySchema,
      debug: _debug,
      label: _label,
      params: _params,
      querySchema: _querySchema,
      requestSchema: _requestSchema,
      responseSchema: _responseSchema,
      retry: _retry,
      timeoutMs: _timeoutMs,
      ...requestOptions
    } = options;
    const requestInit: RequestInit = {
      ...requestOptions,
      credentials: options.credentials ?? config.fetcher.credentials,
      headers,
      method,
      signal: options.signal ?? timeout.signal,
    };

    if (body !== undefined) {
      requestInit.body = body;
    }

    const response = await fetch(
      buildUrl(path, options.baseUrl ?? config.fetcher.baseUrl, params),
      requestInit
    );

    const data = await parseResponse(response);

    if (!response.ok) {
      await runStatusHooks(response.status, path, data);
      throw new ApiError(
        messageFromErrorBody(data, response.status, response.statusText),
        response.status,
        data,
        response.statusText
      );
    }

    if (options.responseSchema) {
      return validateWithSchema(options.responseSchema, data, 'response', {
        debug: options.debug,
        label: options.label ?? path,
      }) as TResponse;
    }

    return data as TResponse;
  } finally {
    timeout.clear();
  }
}

function createFetcher(authAware: boolean): FetcherClient {
  const request = async <
    TResponse = unknown,
    TBody = unknown,
    TResponseSchema extends z.ZodType | undefined = undefined,
    TQuerySchema extends z.ZodType | undefined = undefined,
    TBodySchema extends z.ZodType | undefined = undefined,
  >(
    path: string,
    options: FetcherOptions<
      TBody,
      TResponseSchema,
      TQuerySchema,
      TBodySchema
    > = {}
  ): Promise<
    TResponseSchema extends z.ZodType ? z.infer<TResponseSchema> : TResponse
  > => {
    const config = resolveAppConfig();
    const method: HttpMethod = options.method ?? 'GET';
    const retryOptions: FetcherRetryOptions = normalizeRetryOptions(
      options.retry,
      config.fetcher.retry
    );
    const authHeaders = authAware ? await resolveAuthHeaders() : undefined;

    for (let attempt = 0; attempt <= retryOptions.attempts; attempt += 1) {
      try {
        return (await requestOnce<
          TResponse,
          TBody,
          TResponseSchema,
          TQuerySchema,
          TBodySchema
        >(
          path,
          { ...options, method },
          authHeaders
        )) as TResponseSchema extends z.ZodType
          ? z.infer<TResponseSchema>
          : TResponse;
      } catch (error) {
        const isLastAttempt = attempt >= retryOptions.attempts;
        const canRetry =
          error instanceof ApiError &&
          isRetryableMethod(method) &&
          isTransientStatus(error.status);

        if (isLastAttempt || !canRetry) {
          throw error;
        }

        await waitForRetry(retryOptions.delayMs);
      }
    }

    throw new Error('Unexpected fetcher retry flow');
  };

  return {
    request,
    get: (path, options) => request(path, { ...options, method: 'GET' }),
    post: (path, body, options) =>
      request(path, { ...options, body, method: 'POST' }),
    put: (path, body, options) =>
      request(path, { ...options, body, method: 'PUT' }),
    patch: (path, body, options) =>
      request(path, { ...options, body, method: 'PATCH' }),
    delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
  };
}

export const baseFetcher = createFetcher(false);
export const appFetcher = createFetcher(true);
export const api = appFetcher;
