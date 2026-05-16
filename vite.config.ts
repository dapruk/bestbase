import { fileURLToPath, URL } from 'node:url';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@/app': fileURLToPath(new URL('./src/app', import.meta.url)),
      '@/core': fileURLToPath(new URL('./src/core', import.meta.url)),
      '@/features': fileURLToPath(new URL('./src/features', import.meta.url)),
      '@/layouts': fileURLToPath(new URL('./src/layouts', import.meta.url)),
      '@/pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
      '@/shared': fileURLToPath(new URL('./src/shared', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
});
