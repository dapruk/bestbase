export interface FormatNumberOptions extends Intl.NumberFormatOptions {
  fallback?: string | undefined;
  locale?: string | undefined;
}

export function formatNumber(
  value: number | string | null | undefined,
  options: FormatNumberOptions = {}
) {
  const { fallback = '-', locale = 'id-ID', ...numberFormatOptions } = options;
  const amount = toFiniteNumber(value);

  if (amount === null) return fallback;

  return new Intl.NumberFormat(locale, numberFormatOptions).format(amount);
}

function toFiniteNumber(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === '') return null;
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
}
