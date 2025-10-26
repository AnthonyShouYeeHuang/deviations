import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react(), tailwind()],
  resolve: {
    alias: {
      '@acme/core': fileURLToPath(new URL('../../packages/core/src', import.meta.url))
    }
  },
  server: {
    proxy: { '/api': 'http://127.0.0.1:8787' }
  }
})