# State Persistence

Adapter tersedia untuk localStorage, sessionStorage, Redis-through-API, dan
memory untuk test. Semua adapter async. Envelope persisted state berisi data,
version, dan updatedAt. Jangan persist token, password, atau secret di browser
storage.
