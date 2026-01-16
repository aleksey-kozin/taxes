import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: './', // Для GitHub Pages
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React и React DOM в отдельный чанк
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Recharts в отдельный чанк (большая библиотека)
          'recharts-vendor': ['recharts'],
          // Zustand в отдельный чанк
          'zustand-vendor': ['zustand'],
          // Radix UI компоненты
          'radix-vendor': [
            '@radix-ui/react-tabs',
            '@radix-ui/react-slot',
          ],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Увеличиваем лимит предупреждения до 1MB
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
  },
})
