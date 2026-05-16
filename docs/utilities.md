# Utilities Guide

Before creating a new utility, check this document and `src/shared/utils` first.
Do not duplicate existing helpers.

Utilities already exist in `src/shared/utils` and are exported from
`src/shared/utils/index.ts`. Developers and AI agents should reuse these helpers
before adding new ones. New shared utilities should only be added when no
existing helper solves the problem.

Shared utilities must stay domain-free and reusable. Business-specific logic
belongs in `src/features/{feature}/utils`, not `src/shared/utils`.

## Before Creating a New Utility

Search `docs/utilities.md` first, then search `src/shared/utils`.

Reuse an existing helper when possible. If a new helper is truly needed, keep it
small, domain-free, and easy to test. Add headless Vitest tests and export it
from `src/shared/utils/index.ts`.

Feature-specific helpers should live inside the owning feature folder, for
example `src/features/products/utils`.

## Import Convention

Prefer importing shared utilities from the barrel file:

```ts
import { completeImageUrl, formatCurrency } from '@/shared/utils';
```

All shared utility files should be exported from:

```txt
src/shared/utils/index.ts
```

## URL Utilities

File: `src/shared/utils/url.ts`

Purpose: normalize URLs and query strings without browser-specific assumptions.

Exports:

- `isAbsoluteUrl(url)`
- `joinUrl(baseUrl, path)`
- `ensureLeadingSlash(path)`
- `removeTrailingSlash(path)`
- `buildQuery(queryParams)`

Use these when building request paths, asset paths, or query strings.

```ts
buildQuery({
  search: 'pomade',
  page: 1,
  status: ['active', 'draft'],
});
```

`buildQuery` skips `undefined`, `null`, and empty strings. It keeps `false` and
`0`, and supports arrays by repeating the query key.

Do not use these for router navigation decisions or business-specific query
mapping that belongs in a feature container/store.

## Image URL Utilities

File: `src/shared/utils/image-url.ts`

Purpose: complete incomplete backend image paths consistently.

Exports:

- `completeImageUrl(src, options?)`

`completeImageUrl` uses `app.config.ts > assets.imageBaseUrl` for relative image
paths and `app.config.ts > assets.fallbackImageUrl` when the source is missing.
Absolute `http`, `https`, `blob`, and `data` URLs are returned as-is.

```ts
completeImageUrl('/uploads/product.png');
completeImageUrl('https://cdn.example.com/product.png');
completeImageUrl(null);
```

Use this for backend-provided image paths. Do not use it for non-image API URLs.

Related config:

```ts
assets: {
  imageBaseUrl: import.meta.env.VITE_IMAGE_BASE_URL ?? '',
  fallbackImageUrl: '/images/fallback-image.png',
}
```

## AppImage Component

Folder: `src/shared/components/data-display/app-image/`

Purpose: render images whose source may be incomplete or may fail to load.

Use `AppImage` instead of manual `<img>` when an image URL may come from the
backend as a relative path. It uses `completeImageUrl` internally, supports a
fallback image, and switches to fallback when image loading fails.

```tsx
import { AppImage } from '@/shared/components/data-display/app-image';

<AppImage
  src={product.imageUrl}
  alt={product.name}
  className="h-12 w-12 rounded-md object-cover"
/>;
```

Do not use `AppImage` for icons or decorative UI assets already imported by the
bundler.

## Currency Utilities

File: `src/shared/utils/format-currency.ts`

Purpose: format currency consistently for office UI.

Exports:

- `formatCurrency(value, options?)`

Defaults are `id-ID`, `IDR`, and zero maximum fraction digits. Invalid values
return the fallback, defaulting to `'-'`.

```ts
formatCurrency(1000000); // "Rp1.000.000,-"
formatCurrency(null); // "-"
```

Use this for money display. Do not use it for calculations or storing numeric
values.

Related config:

```ts
format: {
  currency: {
    locale: 'id-ID',
    currency: 'IDR',
    maximumFractionDigits: 0,
  },
}
```

## Date Utilities

File: `src/shared/utils/format-date.ts`

Purpose: format dates consistently using `date-fns`.

Exports:

- `formatDate(value, options?)`
- `formatDateTime(value, options?)`
- `formatTime(value, options?)`
- `formatRelativeDate(value, options?)`

Date utilities use `date-fns` with Indonesian locale support. Developers should
not manually format dates in components. Use these wrappers for office
consistency and fallback handling.

```ts
formatDate('2026-05-16T10:00:00Z');
formatDateTime(new Date());
formatTime('2026-05-16T10:00:00Z');
```

Use these for display formatting. Do not use them for date validation rules that
belong in feature schemas.

## Number Utilities

File: `src/shared/utils/format-number.ts`

Purpose: format numbers with `Intl.NumberFormat`.

Exports:

- `formatNumber(value, options?)`

```ts
formatNumber(10000);
```

Use this for display numbers. Do not use it before sending numeric values to an
API.

## File Size Utilities

File: `src/shared/utils/format-file-size.ts`

Purpose: format byte sizes for UI display.

Exports:

- `formatFileSize(bytes, options?)`

Supports `B`, `KB`, `MB`, `GB`, and `TB`.

```ts
formatFileSize(1024); // "1 KB"
```

Use this for upload/download metadata. Do not use it for storage quota logic.

## Device Utilities

File: `src/shared/utils/device.ts`

Purpose: headless viewport helpers.

Exports:

- `isMobileViewport(width, breakpoint?)`
- `getMobileBreakpoint(config?)`

Hook location:

```txt
src/shared/hooks/use-is-mobile.ts
```

`isMobileViewport` is pure and safe for tests. `useIsMobile` is the React hook
for components. The default breakpoint comes from
`app.config.ts > ui.breakpoints.mobile`.

```ts
isMobileViewport(375);
```

```tsx
import { useIsMobile } from '@/shared/hooks/use-is-mobile';

const isMobile = useIsMobile();
```

Use the hook in React components. Use the pure function in stores, tests, and
non-React code. Do not put responsive business rules in shared utilities.

## Error Utilities

File: `src/shared/utils/error.ts`

Purpose: safely read useful information from unknown errors.

Exports:

- `getErrorMessage(error, fallback?)`
- `getErrorStatus(error)`
- `isErrorWithMessage(error)`

Use `getErrorMessage` for unknown catch errors and TanStack Query error states.

```ts
try {
  // ...
} catch (error) {
  toast.error(getErrorMessage(error));
}
```

Do not put auth redirects, retry behavior, or API side effects in these helpers.

## Class Name Utility

File: `src/shared/utils/cn.ts`

Purpose: compose Tailwind class names safely.

Exports:

- `cn(...inputs)`

`cn` uses `clsx` and `tailwind-merge`.

```ts
cn('p-4', isActive && 'bg-primary');
```

Use this for conditional `className` composition. Do not create local `clsx` or
`classNames` wrappers with different names.

## String Utilities

File: `src/shared/utils/string.ts`

Purpose: common domain-free string transformations.

Exports:

- `truncateText(value, maxLength, suffix?)`
- `toTitleCase(value)`
- `toKebabCase(value)`
- `toCamelCase(value)`
- `toPascalCase(value)`
- `emptyToNull(value)`
- `nullToEmpty(value)`

```ts
truncateText('Long product name', 10);
toTitleCase('hello world');
toKebabCase('Product Category');
toCamelCase('product category');
toPascalCase('product category');
emptyToNull('');
nullToEmpty(null);
```

Use these for generic UI/string normalization. Do not put feature vocabulary,
labels, or business naming rules here.

## Array Utilities

File: `src/shared/utils/array.ts`

Purpose: small generic array helpers.

Exports:

- `uniqueBy(items, getKey)`
- `groupBy(items, getKey)`
- `chunkArray(items, size)`
- `compactArray(items)`

```ts
uniqueBy(users, (user) => user.id);
groupBy(items, (item) => item.status);
chunkArray(items, 3);
compactArray([1, null, 2, false]);
```

Use these for domain-free collection transforms. Do not put API-specific mapping
or feature-specific grouping rules here.

## Object Utilities

File: `src/shared/utils/object.ts`

Purpose: small generic object helpers.

Exports:

- `omitEmptyValues(object)`
- `pick(object, keys)`
- `omit(object, keys)`

`omitEmptyValues` removes `undefined`, `null`, and empty string. It does not
remove `false` or `0`.

```ts
omitEmptyValues({ search: '', page: 1, active: false });
pick(user, ['id', 'name']);
omit(user, ['password']);
```

Use these for generic object shaping. Do not use them as a replacement for Zod
schemas or feature mappers.

## Async Utilities

File: `src/shared/utils/async.ts`

Purpose: small framework-agnostic async helpers.

Exports:

- `sleep(ms)`
- `withTimeout(promise, timeoutMs, message?)`
- `createDeferred<T>()`

```ts
await sleep(300);
await withTimeout(fetchSomething(), 5000, 'Request timed out');

const deferred = createDeferred<string>();
deferred.resolve('done');
await deferred.promise;
```

Use these for tests, simple timing, and promise coordination. Do not put API
clients, retries, or query behavior here.

## Testing Utilities

Utility tests currently live at:

```txt
src/shared/utils/shared-utils.test.ts
```

New utilities should have headless Vitest tests. Prefer colocated `*.test.ts`
files for pure utilities and avoid DOM tests unless the utility is a React hook
or component.

## Adding a New Utility

Rules for adding a shared utility:

- Check this document and `src/shared/utils` first.
- Keep the helper domain-free and reusable.
- Add unit tests.
- Export it from `src/shared/utils/index.ts`.
- Document it in `docs/utilities.md`.
- If it needs config, mention the `app.config.ts` field.
- Do not add large dependencies unless justified.

## What Not To Put In Shared Utilities

Do not put these in `src/shared/utils`:

- product-specific logic
- booking-specific logic
- auth-specific side effects
- guard-specific decisions
- API calls
- React-only logic except hooks/components in the correct folders
- business validation that belongs in feature schemas

## Instruction for Future AI Agents

If you are an AI agent modifying this codebase, check this file and
`src/shared/utils` before creating utility functions. Reuse existing helpers when
possible. Do not duplicate utilities with different names. If you add a new
utility, add tests, export it from `src/shared/utils/index.ts`, and update this
document.
