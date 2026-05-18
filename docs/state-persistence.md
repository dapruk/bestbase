# State Persistence

Adapter tersedia untuk localStorage, sessionStorage, Redis-through-API, dan
memory untuk test. Semua adapter async. Envelope persisted state berisi data,
version, dan updatedAt. Jangan persist token, password, atau secret di browser
storage.

Adapter localStorage/sessionStorage adalah browser-only. Jangan gunakan untuk
data sensitif seperti access token, refresh token, password, atau secret. Untuk
persistence lintas device/server, gunakan adapter Redis-through-API agar browser
tidak terhubung langsung ke Redis.
