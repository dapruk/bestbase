# Arsitektur

Bestbase memisahkan platform code dan business feature code. `src/core` hanya
berisi infrastruktur reusable, sedangkan `src/features` berisi domain bisnis.

Alur bootstrap: resolve config, cek versi aplikasi, inisialisasi PWA, siapkan
auth/query/guard provider, lalu mount router.
