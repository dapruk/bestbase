# Utilities

Fase ini belum membuat katalog utility besar. Utility utama yang sudah ada
berada di `src/core`, bukan `src/shared/utils`.

Yang tersedia saat ini:

- `src/core/rx/create-store.ts`
- `src/core/rx/use-observable-state.ts`
- `src/core/state/persistence/*`
- `src/core/http/fetcher.ts`
- `src/core/version/*`

Aturan penambahan utility:

- utility domain-free masuk ke `src/shared` atau `src/core` sesuai tanggung
  jawabnya
- utility domain-specific masuk ke `src/features/{feature}/utils`
- hindari helper baru jika logic masih sederhana
- tambahkan test headless `.test.ts` untuk utility yang punya behavior penting

Jika nanti `src/shared/utils` dibuat, dokumentasikan exports dan contoh
penggunaannya di file ini.
