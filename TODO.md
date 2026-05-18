# TODO

## Deployment

- Tentukan strategi deploy untuk kapan `versioning.remote.enabled` aktif.
- Tambahkan artifact upload dan deployment workflow setelah strategi CI/CD
  disepakati.
- Tentukan mekanisme inject `VITE_APP_VERSION`/build id untuk staging dan
  production.

## Auth Integration

- Tambahkan `versioning.cleanupHooks` per aplikasi saat auth backend sudah final.
- Validasi flow session expired, refresh placeholder, dan redirect intent dengan
  backend nyata.

## PWA

- Jika PWA/service worker diaktifkan, validasi update flow di staging.

## Samples

- Buat sample feature setelah fondasi basecode stabil.
- Buat contoh list/detail/form yang memakai DataTable dan generator `--list-view`.
