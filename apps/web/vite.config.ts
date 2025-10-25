import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
  plugins: [react(), tailwind()],
  resolve: {
    alias: {
      '@acme/core': path.resolve(__dirname, '../../packages/core/src'),
    },
  },
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:8787', // Wrangler dev default
    },
  },
})