interface ErrorWithMessage {
  message: string;
}

interface ErrorWithStatus {
  status?: number;
  data?: unknown;
}

export function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as ErrorWithMessage).message === 'string'
  );
}

export function getErrorMessage(
  error: unknown,
  fallback = 'Something went wrong'
) {
  if (isErrorWithMessage(error)) return error.message;
  if (typeof error === 'string' && error) return error;

  if (typeof error === 'object' && error !== null && 'data' in error) {
    const data = (error as ErrorWithStatus).data;
    if (isErrorWithMessage(data)) return data.message;
  }

  return fallback;
}

export function getErrorStatus(error: unknown) {
  if (typeof error !== 'object' || error === null || !('status' in error)) {
    return undefined;
  }

  const status = (error as ErrorWithStatus).status;
  return typeof status === 'number' ? status : undefined;
}
