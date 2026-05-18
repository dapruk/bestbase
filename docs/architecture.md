# Arsitektur

Bestbase adalah fondasi frontend React internal berbasis Vite, TypeScript, npm,
TanStack Router, TanStack Query, RxJS, Zod, dan guardap.

Fokus fase ini adalah platform reusable, bukan sample app. Halaman yang tersedia
masih minimal untuk memvalidasi bootstrap, router, auth-ready flow, dan guard.

## Lapisan Utama

- `src/app`: bootstrap, provider aplikasi, dan urutan initialization.
- `src/core`: infrastruktur platform seperti config, fetcher, auth, guard,
  query, RxJS store, persistence, versioning, dan PWA.
- `src/router`: setup router dan adapter route guard.
- `src/pages`: route composition minimal.
- `src/layouts`: layout aplikasi.
- `src/shared`: komponen reusable bebas domain.
- `src/features`: fitur/domain bisnis.

## Bootstrap

Urutan bootstrap konseptual:

1. Resolve config melalui `resolveAppConfig()`.
2. Konfigurasi hook fetcher dari `app.config.ts`.
3. Jalankan app version/cache handling.
4. Inisialisasi PWA manager.
5. Siapkan Query/Auth provider.
6. Mount TanStack Router.

Runtime tidak mengimpor `app.config.ts` langsung kecuali dari resolver config.

## Router

Router default saat ini adalah TanStack Router. Route awal:

- `/`
- `/login`
- `/dashboard`
- `/forbidden`
- `/not-found`

React Router belum diimplementasikan; foldernya hanya placeholder dokumentasi
untuk adapter masa depan.
