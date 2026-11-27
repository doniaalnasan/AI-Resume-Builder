import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  base: '/AI-Resume-Builder/',
  server: {
    proxy: {
      '/cv': {
        target: 'https://smart-store.devamer.online',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})