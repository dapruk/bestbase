# PWA

Bestbase PWA-ready melalui `manifest.webmanifest` dan `pwa.manager.ts`.
Konfigurasi ada di `app.config.ts`: `enabled`, `updateMode`, dan
`offlineFallback`. Fase ini belum offline-first.

Version/cache busting tetap ditangani oleh `src/core/version`. Jika PWA atau
service worker diaktifkan pada aplikasi turunan, pastikan deploy juga
menjalankan `npm run version:generate` supaya `/version.json` ikut berubah
bersama bundle baru. Mode aggressive dapat membersihkan CacheStorage, tetapi
Bestbase tidak mendaftarkan service worker agresif secara default.
