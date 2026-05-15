import type { z } from 'zod';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type Stringable = string | number | boolean | undefined | null;

export type QueryParams = Record<string, Stringable>;

export type FetcherHook = (error: {
  data: unknown;
  path: string;
  status: number;
}) => void | Promise<void>;

export interface FetcherRetryOptions {
  attempts: number;
  delayMs: number;
}

export interface FetcherRuntimeConfig {
  onForbidden?: FetcherHook | undefined;
  onUnauthorized?: FetcherHook | undefined;
}

export interface FetcherOptions<
  TBody = unknown,
  TResponseSchema extends z.ZodType | undefined = undefined,
  TQuerySchema extends z.ZodType | undefined = undefined,
  TBodySchema extends z.ZodType | undefined = undefined,
> extends Omit<RequestInit, 'body' | 'method'> {
  baseUrl?: string;
  body?: TBody;
  bodySchema?: TBodySchema;
  debug?: boolean;
  label?: string;
  method?: HttpMethod;
  params?: QueryParams;
  querySchema?: TQuerySchema;
  requestSchema?: TBodySchema;
  responseSchema?: TResponseSchema;
  retry?: FetcherRetryOptions | false;
  timeoutMs?: number;
}

export interface FetcherClient {
  request: <
    TResponse = unknown,
    TBody = unknown,
    TResponseSchema extends z.ZodType | undefined = undefined,
    TQuerySchema extends z.ZodType | undefined = undefined,
    TBodySchema extends z.ZodType | undefined = undefined,
  >(
    path: string,
    options?: FetcherOptions<TBody, TResponseSchema, TQuerySchema, TBodySchema>
  ) => Promise<
    TResponseSchema extends z.ZodType ? z.infer<TResponseSchema> : TResponse
  >;
  get: <
    TResponse = unknown,
    TResponseSchema extends z.ZodType | undefined = undefined,
    TQuerySchema extends z.ZodType | undefined = undefined,
  >(
    path: string,
    options?: FetcherOptions<unknown, TResponseSchema, TQuerySchema>
  ) => Promise<
    TResponseSchema extends z.ZodType ? z.infer<TResponseSchema> : TResponse
  >;
  post: <
    TResponse = unknown,
    TBody = unknown,
    TResponseSchema extends z.ZodType | undefined = undefined,
    TQuerySchema extends z.ZodType | undefined = undefined,
    TBodySchema extends z.ZodType | undefined = undefined,
  >(
    path: string,
    body?: TBody,
    options?: FetcherOptions<TBody, TResponseSchema, TQuerySchema, TBodySchema>
  ) => Promise<
    TResponseSchema extends z.ZodType ? z.infer<TResponseSchema> : TResponse
  >;
  put: <
    TResponse = unknown,
    TBody = unknown,
    TResponseSchema extends z.ZodType | undefined = undefined,
    TQuerySchema extends z.ZodType | undefined = undefined,
    TBodySchema extends z.ZodType | undefined = undefined,
  >(
    path: string,
    body?: TBody,
    options?: FetcherOptions<TBody, TResponseSchema, TQuerySchema, TBodySchema>
  ) => Promise<
    TResponseSchema extends z.ZodType ? z.infer<TResponseSchema> : TResponse
  >;
  patch: <
    TResponse = unknown,
    TBody = unknown,
    TResponseSchema extends z.ZodType | undefined = undefined,
    TQuerySchema extends z.ZodType | undefined = undefined,
    TBodySchema extends z.ZodType | undefined = undefined,
  >(
    path: string,
    body?: TBody,
    options?: FetcherOptions<TBody, TResponseSchema, TQuerySchema, TBodySchema>
  ) => Promise<
    TResponseSchema extends z.ZodType ? z.infer<TResponseSchema> : TResponse
  >;
  delete: <
    TResponse = unknown,
    TResponseSchema extends z.ZodType | undefined = undefined,
    TQuerySchema extends z.ZodType | undefined = undefined,
  >(
    path: string,
    options?: FetcherOptions<unknown, TResponseSchema, TQuerySchema>
  ) => Promise<
    TResponseSchema extends z.ZodType ? z.infer<TResponseSchema> : TResponse
  >;
}
