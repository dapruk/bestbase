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

  return new Intl.NumberFormat(options.locale ?? config.locale, {
    currency: options.currency ?? config.currency,
    maximumFractionDigits:
      options.maximumFractionDigits ?? config.maximumFractionDigits,
    minimumFractionDigits: options.minimumFractionDigits,
    style: 'currency',
  }).format(amount);
}

function toFiniteNumber(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === '') return null;
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
}
