import { format, formatDistanceToNow, isValid } from 'date-fns';
import { id } from 'date-fns/locale';

export interface FormatDateOptions {
  fallback?: string | undefined;
  format?: string | undefined;
}

type DateInput = Date | number | string | null | undefined;

export function formatDate(value: DateInput, options: FormatDateOptions = {}) {
  return formatDateValue(value, options.format ?? 'dd MMM yyyy', options);
}

export function formatDateTime(
  value: DateInput,
  options: FormatDateOptions = {}
) {
  return formatDateValue(value, options.format ?? 'dd MMM yyyy HH:mm', options);
}

export function formatTime(value: DateInput, options: FormatDateOptions = {}) {
  return formatDateValue(value, options.format ?? 'HH:mm', options);
}

export function formatRelativeDate(
  value: DateInput,
  options: Omit<FormatDateOptions, 'format'> = {}
) {
  const date = parseDate(value);
  if (!date) return options.fallback ?? '-';
  return formatDistanceToNow(date, { addSuffix: true, locale: id });
}

function formatDateValue(
  value: DateInput,
  dateFormat: string,
  options: FormatDateOptions
) {
  const date = parseDate(value);
  if (!date) return options.fallback ?? '-';
  return format(date, dateFormat, { locale: id });
}

function parseDate(value: DateInput) {
  if (value === null || value === undefined || value === '') return null;
  const date = value instanceof Date ? value : new Date(value);
  return isValid(date) ? date : null;
}
