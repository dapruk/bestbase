# Bestbase

Bestbase adalah basecode frontend internal berbasis Vite, React, TypeScript,
npm, TanStack Router, TanStack Query, RxJS, Zod, dan guardap.

Fase ini fokus pada fondasi reusable, bukan sample app yang polished.

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

Gunakan Node LTS dari `.nvmrc`:

```bash
nvm use
```

## Struktur

- `src/app`: bootstrap dan provider aplikasi.
- `src/core`: config, fetcher, auth, guard, query, RxJS, persistence,
  versioning, dan PWA.
- `src/router`: setup TanStack Router dan route guard adapter.
- `src/pages`: composition layer minimal.
- `src/layouts`: layout aplikasi.
- `src/shared`: komponen reusable bebas domain.
- `src/features`: fitur/domain bisnis.

## Prinsip

Komponen React dibuat dumb/presentational sebanyak mungkin. Business logic hidup
di store, service, schema, guardap config, fetcher, persistence utility, atau
pure utils.

RxJS dipakai sebagai headless state layer ringan, bukan BLoC besar. Test default
menggunakan `.test.ts`; `.test.tsx` hanya untuk kasus render UI.

## Konfigurasi

`app.config.ts` adalah pusat konfigurasi app. Runtime harus membaca config
melalui `resolveAppConfig()`, bukan import langsung ke banyak tempat.

## Fetcher dan Query

`baseFetcher` dipakai untuk endpoint tanpa dependency auth. `appFetcher` atau
`api` dipakai untuk endpoint bisnis.

Fetcher mendukung schema validation dengan Zod:

- `responseSchema`
- `querySchema`
- `bodySchema`
- `requestSchema`

HTTP non-OK dilempar sebagai `ApiError`. Validasi schema dilempar sebagai
`SchemaValidationError`. Fetcher tidak melakukan redirect/logout langsung;
gunakan hook `onUnauthorized` dan `onForbidden`.

TanStack Query memegang server-state cache. Fetcher tidak membuat cache sendiri.

## Auth dan Guardap

Auth default adalah cookie-based session. Token sensitif tidak boleh disimpan di
localStorage/sessionStorage.

Guard memakai guardap `1.2.0`. Folder `src/core/guard` hanya berisi instance
guardap dan adapter route TanStack. Bestbase tidak membuat custom `Can`,
`useCan`, permission parser, atau authorization engine sendiri.

## DataTable

DataTable tersedia di:

```ts
import { DataTable } from '@/shared/components/data-display/data-table';
```

DataTable controlled dan presentational. Feature store/container mengatur
search, filter, sorting, pagination, API call, dan permission row action.

## Generator

```bash
npm run bbase -- gen feat product
npm run bbase -- gen feat product --list-view
npm run bbase -- gen component product-table --feature product
npm run bbase -- gen store product-list --feature product
```

`--list-view` membuat scaffold dasar list/detail/form, bukan full CRUD polished.

## Docs

Mulai dari [docs/README.md](docs/README.md).

Samples/examples akan ditambahkan setelah fondasi core basecode selesai.
