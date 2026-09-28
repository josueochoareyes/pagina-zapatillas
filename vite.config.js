import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    watch: {
      // Chrome test profiles contain locked files and are not application sources.
      ignored: ['**/output/**'],
    },
  },
})
