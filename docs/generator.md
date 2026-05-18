# Generator

CLI lokal dipanggil dengan:

```bash
npm run bbase -- ...
```

Command yang tersedia saat ini:

```bash
npm run bbase -- gen feat product
npm run bbase -- gen feat product --list-view
npm run bbase -- gen component product-table --feature product
npm run bbase -- gen store product-list --feature product
```

## Feature

```bash
npm run bbase -- gen feat product
```

Membuat skeleton:

```txt
src/features/product/
  components/
  containers/
  stores/
  hooks/
  services/
  schemas/
  types/
  utils/
  constants/
  pages/
  index.ts
```

Generator memakai kebab-case untuk file/folder dan PascalCase untuk nama
komponen.

## List View

```bash
npm run bbase -- gen feat product --list-view
```

Membuat scaffold dasar:

- types
- permission constants
- schemas
- service dengan schema fetcher
- list/detail/form containers
- list/detail/form pages
- mapper

Preset ini belum membuat:

- route registration otomatis
- nav registration
- full CRUD UI
- polished table columns
- modal action workflows

## Component

```bash
npm run bbase -- gen component product-table --feature product
```

Membuat komponen sederhana di feature target.

## Store

```bash
npm run bbase -- gen store product-list --feature product
```

Membuat RxJS store ringan berbasis `createStore()`.

## Opsi

Opsi yang sudah dikenali parser:

- `--dry-run`
- `--force`
- `--route`
- `--path`
- `--protected`
- `--public`
- `--permission`
- `--nav`
- `--store`
- `--service`
- `--schema`
- `--test`
- `--persist`
- `--list-view`

Beberapa opsi route/nav masih scaffold-only pada fase ini.
