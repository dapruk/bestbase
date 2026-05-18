# Panduan Implementasi CI/CD

CI/CD sengaja dipisahkan dari fase basecode pertama. File ini wajib dibaca
sebelum menambahkan deployment workflow agar pipeline tetap selaras dengan
Bestbase.

## Aturan Dasar

- Gunakan npm, bukan pnpm/yarn/bun.
- Setup Node dari `.nvmrc`.
- Gunakan `npm ci` untuk install dependency di CI.
- Jangan membuat deployment workflow penuh tanpa desain environment staging dan
  production.

## Check Workflow Saat Ini

`.github/workflows/check.yml` adalah workflow komprehensif untuk validasi:

- `npm ci`
- `npm run typecheck`
- `npm run lint`
- `npm run test:unit`
- `npm run build`

## Versioning dan Cache Busting

Future CI/CD harus meng-inject versi build melalui `VITE_APP_VERSION` atau
fallback ke `package.json` version. Jalankan:

```bash
npm run version:generate
```

Local development boleh memakai:

```bash
npm run version:generate -- --local
```

Suffix `-local` hanya untuk local development. Staging/production harus memakai
versi release tanpa suffix lokal.

## Scope CI/CD Berikutnya

- setup Node dari `.nvmrc`
- `npm ci`
- typecheck
- lint
- format check
- headless unit tests
- build
- artifact upload
- separation staging/production
- app version/build id injection
- perhatian deploy untuk PWA/service worker
- rollback
- optional Sentry release
- optional deployment notification
