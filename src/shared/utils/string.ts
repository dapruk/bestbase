export function truncateText(value: string, maxLength: number, suffix = '...') {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, Math.max(0, maxLength - suffix.length))}${suffix}`;
}

export function toTitleCase(value: string) {
  return words(value)
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`)
    .join(' ');
}

export function toKebabCase(value: string) {
  return words(value).join('-').toLowerCase();
}

export function toCamelCase(value: string) {
  const [first = '', ...rest] = words(value).map((word) => word.toLowerCase());
  return `${first}${rest.map(capitalize).join('')}`;
}

export function toPascalCase(value: string) {
  return words(value)
    .map((word) => capitalize(word.toLowerCase()))
    .join('');
}

export function emptyToNull(value: string | null | undefined) {
  return value === '' ? null : value;
}

export function nullToEmpty(value: string | null | undefined) {
  return value ?? '';
}

function words(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean);
}

function capitalize(value: string) {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}
