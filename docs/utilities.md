# Utilities

Utility domain-free berada di `src/shared/utils`. File ini menjadi katalog agar
developer dan AI agent tidak membuat helper baru yang sudah tersedia.

Yang tersedia saat ini:

- `array.ts`
- `async.ts`
- `cn.ts`
- `device.ts`
- `error.ts`
- `format-currency.ts`
- `format-date.ts`
- `format-file-size.ts`
- `format-number.ts`
- `image-url.ts`
- `object.ts`
- `string.ts`
- `url.ts`
- `index.ts`

Aturan penambahan utility:

- utility domain-free masuk ke `src/shared/utils`
- utility platform/core masuk ke `src/core`
- utility domain-specific masuk ke `src/features/{feature}/utils`
- hindari helper baru jika logic masih sederhana
- tambahkan test headless `.test.ts` untuk utility yang punya behavior penting

## Instruction for Future AI Agents

Sebelum membuat helper baru, cek `src/shared/utils/index.ts` dan file ini.
Gunakan helper yang sudah ada jika behavior cocok. Jika helper baru memang
dibutuhkan, tambahkan export, test, dan update katalog ini di commit yang sama.
