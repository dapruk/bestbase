# Fetcher

Gunakan `baseFetcher` untuk endpoint tanpa dependency auth, terutama auth
session/login/logout. Gunakan `api` atau `appFetcher` untuk endpoint bisnis.

Fetcher mendukung base URL, query params, timeout, retry untuk error transient,
cookie credentials, dan normalized error. Cache data tetap milik TanStack Query.

Schema-based fetcher mendukung `responseSchema`, `querySchema`, dan
`bodySchema`/`requestSchema` dengan Zod. Error validasi dilempar sebagai
`SchemaValidationError` yang membawa issues, first issue summary, raw data, dan
target validasi. HTTP non-OK dilempar sebagai `ApiError`.

Fetcher tetap framework-agnostic. Gunakan `app.config.ts` atau
`configureFetcher()` untuk memasang hook seperti `onUnauthorized` atau
`onForbidden`; auth/router boleh bereaksi dari luar, tetapi fetcher tidak
melakukan redirect atau logout langsung.
