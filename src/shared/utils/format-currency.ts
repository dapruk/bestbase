import { resolveAppConfig } from '@/core/config/resolve-app-config';

export interface FormatCurrencyOptions {
  currency?: string | undefined;
  fallback?: string | undefined;
  locale?: string | undefined;
  maximumFractionDigits?: number | undefined;
  minimumFractionDigits?: number | undefined;
}

export function formatCurrency(
  value: number | string | null | undefined,
  options: FormatCurrencyOptions = {}
) {
  const config = resolveAppConfig().format.currency;
  const fallback = options.fallback ?? '-';
  const amount = toFiniteNumber(value);

  if (amount === null) return fallback;

  const currency = options.currency ?? config.currency;
  const locale = options.locale ?? config.locale;
  const maximumFractionDigits =
    options.maximumFractionDigits ?? config.maximumFractionDigits;
  const minimumFractionDigits = options.minimumFractionDigits;
  const formatted = new Intl.NumberFormat(locale, {
    currency,
    maximumFractionDigits,
    minimumFractionDigits: options.minimumFractionDigits,
    style: 'currency',
  }).format(amount);

  if (
    currency === 'IDR' &&
    maximumFractionDigits === 0 &&
    (minimumFractionDigits === undefined || minimumFractionDigits === 0)
  ) {
    return `${formatted.replace(/Rp\s+/u, 'Rp')},-`;
  }

  return formatted;
}

function toFiniteNumber(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === '') return null;
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
}
