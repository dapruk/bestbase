# App Versioning

Bestbase memakai `src/core/version` untuk deteksi versi aplikasi, cache
busting, dan reset state ringan saat bundle lama bertemu versi baru.

Versi runtime di-resolve dari:

1. `import.meta.env.VITE_APP_VERSION`
2. fallback ke `app.config.ts > app.version`

Pada local development, Bestbase menambahkan suffix `-local` sekali saja. Jika
versi config `0.1.0`, versi lokal menjadi `0.1.0-local`.

## API

```ts
checkAppVersion();
checkAppVersionOnce();
watchAppVersion();
resetApp();
clearBrowserCache();
```

`checkAppVersionOnce()` dipanggil di `AppBootstrap` sebelum aplikasi dirender.
Setelah bootstrap berhasil, `watchAppVersion()` mendaftarkan event seperti
`pageshow`, `visibilitychange`, `focus`, dan `online`.

## Remote Version

Remote check dikendalikan dari `app.config.ts`:

```ts
versioning: {
  remote: {
    enabled: false,
    url: '/version.json',
    cacheBustParam: 't',
    timeoutMs: 5000,
  },
}
```

Ketika aktif, Bestbase fetch `/version.json?t=<timestamp>` dengan `no-store`.
Jika remote version berbeda dari bundle, aplikasi menjalankan cleanup lalu
reload dengan query cache busting.

## Mode Cleanup

- `low`: update versi tersimpan tanpa cleanup besar.
- `mild`: clear `sessionStorage`.
- `aggressive`: clear `localStorage`, `sessionStorage`, CacheStorage, dan
  persisted state scoped aplikasi.

Auth logout, cookie deletion, dan router redirect tidak dilakukan langsung oleh
module ini. Gunakan `versioning.cleanupHooks` untuk injeksi cleanup per aplikasi.

## Reload Loop

Reload dilindungi oleh `versioning.reload.sessionKey` dan
`versioning.reload.maxAttempts`. Jika batas tercapai, hasil check menjadi
`reload-loop-stopped` supaya browser tidak masuk infinite reload.

## version.json

Generate file versi dengan:

```bash
npm run version:generate
npm run version:generate -- --local
```

Build deploy/CI menggunakan versi production tanpa `-local`. Local development
dapat memakai `--local` atau `BESTBASE_LOCAL_VERSION=true` untuk menghasilkan
`public/version.json` dengan suffix `-local`.

Saat menjalankan:

```bash
npm run dev
```

npm akan menjalankan `predev` terlebih dahulu, sehingga `public/version.json`
selalu di-generate ulang dengan versi lokal seperti `0.1.0-local`.
