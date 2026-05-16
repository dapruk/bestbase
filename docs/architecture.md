# Arsitektur

Bestbase memisahkan platform code dan business feature code. `src/core` hanya
berisi infrastruktur reusable, sedangkan `src/features` berisi domain bisnis.

Alur bootstrap: resolve config, cek versi aplikasi, inisialisasi PWA, siapkan
auth/query/guard provider, lalu mount `AppRouter` dari `@/router`.

Basecode mulai dengan router mode `uninitialized`. Jalankan
`npm run bbase -- init` untuk memilih TanStack Router atau React Router. Router
choice tidak boleh dibuat aktif dua-duanya dari awal.

`router.rendering` membedakan SPA/client-only dan server-side capable mode.
Server-side capable mode berarti basecode menghindari asumsi browser-only saat
render/module evaluation; full SSR deployment tetap bergantung pada adapter dan
hosting yang dipilih.
