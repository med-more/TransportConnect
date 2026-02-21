import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
