export type QueryPrimitive = string | number | boolean | undefined | null;
export type QueryValue = QueryPrimitive | QueryPrimitive[];

export function isAbsoluteUrl(url: string) {
  return /^(https?:|blob:|data:)/i.test(url);
}

export function ensureLeadingSlash(path: string) {
  return path.startsWith('/') ? path : `/${path}`;
}

export function removeTrailingSlash(path: string) {
  return path.length > 1 ? path.replace(/\/+$/, '') : path;
}

export function joinUrl(baseUrl: string, path: string) {
  if (!baseUrl) return ensureLeadingSlash(path);
  if (!path) return removeTrailingSlash(baseUrl);
  return `${removeTrailingSlash(baseUrl)}/${path.replace(/^\/+/, '')}`;
}

export function buildQuery(queryParams: Record<string, QueryValue>) {
  const params = new URLSearchParams();

  Object.entries(queryParams).forEach(([key, value]) => {
    const values = Array.isArray(value) ? value : [value];

    values.forEach((item) => {
      if (item === undefined || item === null || item === '') return;
      params.append(key, String(item));
    });
  });

  const query = params.toString();
  return query ? `?${query}` : '';
}
