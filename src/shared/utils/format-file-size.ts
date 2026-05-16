export interface FormatFileSizeOptions {
  decimals?: number | undefined;
  fallback?: string | undefined;
}

const FILE_SIZE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB'] as const;

export function formatFileSize(
  bytes: number | null | undefined,
  options: FormatFileSizeOptions = {}
) {
  const fallback = options.fallback ?? '-';

  if (typeof bytes !== 'number' || !Number.isFinite(bytes) || bytes < 0) {
    return fallback;
  }

  if (bytes === 0) return '0 B';

  const decimals = options.decimals ?? 0;
  const unitIndex = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    FILE_SIZE_UNITS.length - 1
  );
  const value = bytes / 1024 ** unitIndex;

  return `${Number(value.toFixed(decimals))} ${FILE_SIZE_UNITS[unitIndex]}`;
}
