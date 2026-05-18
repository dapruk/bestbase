# Dokumentasi Bestbase

Dokumentasi ini menjelaskan kondisi basecode saat ini. Hindari mendokumentasikan
fitur yang belum ada di repository.

## Dokumen

- [architecture.md](architecture.md): struktur dan bootstrap aplikasi.
- [folder-structure.md](folder-structure.md): aturan folder.
- [fetcher.md](fetcher.md): fetcher, schema validation, dan error handling.
- [auth-lifecycle.md](auth-lifecycle.md): state auth dan lifecycle session.
- [guard-policy.md](guard-policy.md): integrasi guardap-only.
- [data-table.md](data-table.md): DataTable controlled/presentational.
- [state-persistence.md](state-persistence.md): persistence adapters.
- [app-versioning.md](app-versioning.md): version/cache busting.
- [pwa.md](pwa.md): struktur PWA-ready.
- [generator.md](generator.md): CLI `bbase`.
- [testing-strategy.md](testing-strategy.md): strategi test.
- [ui.md](ui.md): status UI shared saat ini.
- [utilities.md](utilities.md): aturan utility.

## Prinsip

Dokumentasi harus mengikuti implementasi aktual. Jika fitur baru ditambahkan,
update dokumen terkait dalam PR/commit yang sama.
