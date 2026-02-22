import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'node:fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // SPA fallback: copy index.html to 404.html so Vercel (and other hosts) can serve the app on 404
    {
      name: 'copy-404',
      closeBundle() {
        const out = path.resolve(__dirname, 'dist')
        const index = path.join(out, 'index.html')
        const fallback = path.join(out, '404.html')
        if (fs.existsSync(index)) fs.copyFileSync(index, fallback)
      },
    },
  ],
  resolve: {
    dedupe: ['react', 'react-dom', 'maplibre-gl'],
    alias: {
      // Ensure react-map-gl/maplibre resolves its optional peer maplibre-gl from project root
      'maplibre-gl': path.resolve(__dirname, 'node_modules/maplibre-gl'),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@tanstack/react-query', 'maplibre-gl'],
  },
})
