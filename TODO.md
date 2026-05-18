# TODO

## Production Hardening Status

Reusable hardening dari backlog sudah diadaptasi sebagai modul Bestbase-native,
bukan raw copy dari project lain.

### Implemented

- App version resolver memakai `VITE_APP_VERSION || app.config.ts > app.version`.
- Local development menambahkan suffix `-local` sekali saja.
- `src/core/version` menyediakan:
  - `checkAppVersion()`
  - `checkAppVersionOnce()`
  - `watchAppVersion()`
  - `resetApp()`
  - `clearBrowserCache()`
- Remote `/version.json` check bisa diaktifkan dari `app.config.ts`.
- Reload cache busting memakai query key configurable.
- Reload-loop protection memakai sessionStorage key configurable.
- Cleanup mode `low`, `mild`, dan `aggressive` tetap berada di version layer.
- Auth/router cleanup tetap injectable via hooks, bukan hardcoded side effect.
- Console suppression production tersedia di `src/core/runtime/console.manager.ts`.
- `npm run version:generate` membuat `public/version.json`.
- Workflow CI tetap memakai `.github/workflows/check.yml` yang lebih lengkap.

### Next Refinements

- Tentukan strategi deploy untuk kapan `versioning.remote.enabled` aktif.
- Tambahkan cleanup hook per aplikasi saat auth backend sudah final.
- Tambahkan artifact upload dan deployment workflow setelah strategi CI/CD
  disepakati. PR build terpisah tidak diperlukan selama `check.yml` sudah
  menjalankan build.
- Jika PWA/service worker diaktifkan, validasi update flow di staging.
