class MemoryStorage implements Storage {
  private readonly values = new Map<string, string>();

  get length() {
    return this.values.size;
  }

  clear() {
    this.values.clear();
  }

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  key(index: number) {
    return Array.from(this.values.keys())[index] ?? null;
  }

  removeItem(key: string) {
    this.values.delete(key);
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

const testLocalStorage = new MemoryStorage();
const testSessionStorage = new MemoryStorage();

Object.defineProperty(globalThis, 'window', {
  configurable: true,
  value: {
    localStorage: testLocalStorage,
    location: {
      hash: '',
      host: 'localhost',
      hostname: 'localhost',
      href: 'http://localhost/',
      origin: 'http://localhost',
      pathname: '/',
      reload: () => undefined,
      search: '',
    },
    sessionStorage: testSessionStorage,
    setTimeout,
    clearTimeout,
  },
});

Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  value: testLocalStorage,
});

Object.defineProperty(globalThis, 'sessionStorage', {
  configurable: true,
  value: testSessionStorage,
});

Object.defineProperty(globalThis, 'navigator', {
  configurable: true,
  value: {
    serviceWorker: undefined,
  },
});
