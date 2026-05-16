# Utilities

Shared utilities ada di `src/shared/utils` dan diekspor dari
`src/shared/utils/index.ts`.

URL dan image:

- `joinUrl`, `buildQuery`, `isAbsoluteUrl`, `ensureLeadingSlash`,
  `removeTrailingSlash`
- `completeImageUrl(src)` memakai `app.config.ts > assets.imageBaseUrl`
- `AppImage` memakai `completeImageUrl` dan fallback saat load error

Formatting:

- `formatCurrency` default ke `id-ID`, `IDR`, tanpa fraction digit
- date utilities memakai `date-fns`: `formatDate`, `formatDateTime`,
  `formatTime`, `formatRelativeDate`
- gunakan shared date utilities, bukan format manual tersebar di feature
- `formatNumber` memakai `Intl.NumberFormat`
- `formatFileSize` mendukung B, KB, MB, GB, TB

Device dan error:

- `isMobileViewport(width)` dan `useIsMobile()` memakai breakpoint dari
  `app.config.ts > ui.breakpoints.mobile`
- `getErrorMessage`, `getErrorStatus`, dan `isErrorWithMessage` menerima
  `Error`, API error shape, dan unknown values

Common helpers:

- `cn()` memakai `clsx` dan `tailwind-merge`
- string: `truncateText`, case conversion, `emptyToNull`, `nullToEmpty`
- array: `uniqueBy`, `groupBy`, `chunkArray`, `compactArray`
- object: `omitEmptyValues`, `pick`, `omit`
- async: `sleep`, `withTimeout`, `createDeferred`
