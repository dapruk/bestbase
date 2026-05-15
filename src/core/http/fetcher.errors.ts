import type { z } from 'zod';

export class ApiError extends Error {
  readonly data: unknown;
  readonly status: number;
  readonly statusText: string;

  constructor(
    message: string,
    status: number,
    data?: unknown,
    statusText = ''
  ) {
    super(message);
    this.name = 'ApiError';
    this.data = data;
    this.status = status;
    this.statusText = statusText;
  }
}

export class FetcherError extends ApiError {
  readonly details: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message, status, details);
    this.name = 'FetcherError';
    this.details = details;
  }
}

export class FetcherTimeoutError extends Error {
  constructor(message = 'Request timed out') {
    super(message);
    this.name = 'FetcherTimeoutError';
  }
}

export type SchemaValidationTarget = 'body' | 'query' | 'response';

export class SchemaValidationError extends Error {
  readonly firstIssueSummary: string;
  readonly issues: z.core.$ZodIssue[];
  readonly rawData: unknown;
  readonly target: SchemaValidationTarget;

  constructor(params: {
    firstIssueSummary: string;
    issues: z.core.$ZodIssue[];
    rawData: unknown;
    target: SchemaValidationTarget;
  }) {
    super(`${params.target} schema validation failed`);
    this.name = 'SchemaValidationError';
    this.firstIssueSummary = params.firstIssueSummary;
    this.issues = params.issues;
    this.rawData = params.rawData;
    this.target = params.target;
  }
}
