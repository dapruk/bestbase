export interface AuthHeaderSource {
  getAccessToken?: () => string | null | Promise<string | null>;
}

let authHeaderSource: AuthHeaderSource | null = null;

export function configureAuthHeaderSource(source: AuthHeaderSource | null) {
  authHeaderSource = source;
}

export async function resolveAuthHeaders(): Promise<HeadersInit> {
  const token = await authHeaderSource?.getAccessToken?.();

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}
