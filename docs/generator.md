# Generator

CLI lokal dipanggil dengan `npm run bbase --`.

```bash
npm run bbase -- gen feat product
npm run bbase -- gen component product-table --feature product
npm run bbase -- gen store product-list --feature product
```

`--list-view` membuat scaffold dasar list/detail/form: page, container, schema,
service, type, permission constants, dan mapper. Fase ini belum membuat route,
nav, atau UI CRUD polished.
