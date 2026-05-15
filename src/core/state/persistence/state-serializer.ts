import type { PersistedStateEnvelope } from './state-persistence.types';

const SENSITIVE_KEY_PATTERN =
  /(accessToken|refreshToken|password|secret|authorization)/i;

export function toPersistenceKey(key: string, namespace?: string): string {
  if (SENSITIVE_KEY_PATTERN.test(key)) {
    throw new Error(`Sensitive key cannot be persisted: ${key}`);
  }

  return namespace ? `${namespace}:${key}` : key;
}

export function serializeState<T>(value: T, version: number): string {
  const envelope: PersistedStateEnvelope<T> = {
    data: value,
    updatedAt: new Date().toISOString(),
    version,
  };

  return JSON.stringify(envelope);
}

export function deserializeState<T>(
  value: string | null,
  version: number,
  migrate?: (value: unknown, fromVersion: number) => T
): T | null {
  if (!value) {
    return null;
  }

  try {
    const envelope = JSON.parse(value) as Partial<PersistedStateEnvelope<T>>;

    if (
      typeof envelope !== 'object' ||
      envelope === null ||
      typeof envelope.version !== 'number' ||
      !('data' in envelope)
    ) {
      return null;
    }

    if (envelope.version !== version) {
      return migrate ? migrate(envelope.data, envelope.version) : null;
    }

    return envelope.data as T;
  } catch {
    return null;
  }
}
