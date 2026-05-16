# Bestbase

Bestbase adalah basecode frontend internal berbasis Vite, React, TypeScript, npm,
TanStack Query, RxJS, Zod, dan guardap. Fokus fase ini adalah fondasi reusable,
bukan aplikasi contoh yang polished.

## Menjalankan Project

```bash
npm install
npm run dev
npm run build
npm run preview
npm run check
npm run test
npm run lint
npm run lint:fix
npm run format
```

Gunakan Node dari `.nvmrc`:

```bash
nvm use
```

## Struktur

- `src/core`: infrastruktur platform seperti config, fetcher, auth, guard,
  query, versioning, PWA, state, dan RxJS utilities.
- `src/features`: fitur/domain bisnis.
- `src/shared`: komponen dan utilitas reusable yang bebas domain.
- `src/pages`: composition layer untuk route.
- `src/layouts`: layout aplikasi.
- `src/router`: setup router dan adapter.
- `src/app`: bootstrap dan provider aplikasi.

## Prinsip Pengembangan

Komponen React dibuat dumb/presentational sebanyak mungkin. Business logic hidup
di store, service, schema, guard, fetcher, persistence utility, atau pure utils.
Gunakan store/container/view separation hanya saat behavior memang cukup berat.

RxJS dipakai sebagai headless state layer ringan, bukan BLoC besar. Test default
menggunakan `.test.ts`; `.test.tsx` hanya untuk kasus render UI.

## Konfigurasi

`app.config.ts` adalah pusat konfigurasi app, tetapi runtime tidak mengimpor file
itu langsung. Gunakan `resolveAppConfig()` agar default dan override selalu
tergabung konsisten.

## Router Initialization

Basecode mulai tipis dengan `router.mode: 'uninitialized'`. Pilih router sekali
melalui local CLI:

```bash
npm run bbase -- init
```

Command ini memilih TanStack Router atau React Router, mengubah
`app.config.ts`, membuat file router dan guard adapter yang sesuai, memilih
rendering mode, dan menginstal dependency router yang dipilih saja. App code
tetap memakai public import stabil:

```ts
import { AppRouter } from '@/router';
```

Jangan mencampur TanStack Router dan React Router dalam satu project kecuali
sedang melakukan custom architecture secara sengaja.

Router mode:

- TanStack Router
- React Router Framework Mode

Rendering mode:

- SPA / Client-side only
- Server-side capable / SSR-ready

Server-side capable mode means base components/utilities avoid unsafe
browser-only assumptions. Full SSR deployment may still need additional
router/framework setup depending on hosting.

## Fetcher dan Query

`baseFetcher` dipakai untuk endpoint auth/session yang tidak bergantung auth.
`appFetcher` atau `api` dipakai untuk endpoint aplikasi. Fetcher tidak membuat
cache data; server-state cache menjadi tanggung jawab TanStack Query.

## Auth dan Guardap

Auth default adalah cookie-based session. Token sensitif tidak boleh disimpan di
localStorage/sessionStorage.

Guardap dikonfigurasi sekali di `src/core/guard/guard.config.ts` mengikuti API
resmi `guardap@1.2.0`: `createGuard(config)`, role, group, condition, feature,
action, login/guest, dan redirect. Gunakan `AccessGuard` dari
`guardap/react` untuk conditional rendering dan fluent API `Guard` untuk direct
checks. Bestbase tidak membuat wrapper `Can/useCan` atau authorization engine
sendiri. Dokumentasi Guardap: https://www.npmjs.com/package/guardap

## UI, Utilities, dan Data Table

Tailwind CSS dan shadcn/ui tersedia dari awal. Komponen shadcn ada di
`src/shared/components/ui`, dengan style `radix-nova`, base color `neutral`, CSS
variables aktif, dan `cn()` di `src/shared/utils/cn.ts`.

## Utilities

Common utilities live in `src/shared/utils`. `AppImage` lives in
`src/shared/components/data-display/app-image`.

Before creating a new helper, check `docs/utilities.md`. Future AI agents should
reuse existing utilities instead of recreating them.

See [docs/utilities.md](docs/utilities.md).

`BbaseDataTable` adalah wrapper default untuk list office di
`src/shared/components/data-display/bbase-data-table`. Wrapper ini memakai DiceUI
Data Table sebagai basis dan menjaga search, filter, sort, pagination, row
actions, loading, empty, dan error state tetap controlled dari feature
store/container. It reads `app.config.ts > dataTable.mode` by default
(`server` for office/API-driven lists) and can be overridden per usage with
`<BbaseDataTable mode="client" />`. Raw DiceUI tetap tersedia sebagai escape
hatch advanced.

List-view preset akan menjadi standar halaman list/detail/form:

- `/product`
- `/product/create`
- `/product/:id`
- `/product/:id/edit`

Fase ini hanya menyediakan fondasi dan scaffold awal.

## Generator

```bash
npm run bbase -- init
npm run bbase -- gen feat product
npm run bbase -- gen feat product --list-view
npm run bbase -- gen component product-table --feature product
npm run bbase -- gen store product-list --feature product
```

Opsi penting: `--dry-run`, `--force`, `--route`, `--protected`, `--public`,
`--permission`, `--store`, `--service`, `--schema`, `--test`, `--persist`.
`bbase gen` membaca `app.config.ts > router.mode`; route/list-view generation
akan meminta `npm run bbase -- init` lebih dulu jika router belum diinisialisasi.

## Versioning dan PWA

App version/cache busting dikontrol dari `app.config.ts` dengan mode `low`,
`mild`, dan `aggressive`. Struktur PWA sudah siap melalui manifest dan manager,
tetapi belum offline-first secara agresif.

Samples/examples akan ditambahkan setelah fondasi core basecode selesai.
