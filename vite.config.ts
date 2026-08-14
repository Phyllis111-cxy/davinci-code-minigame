import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ command }) => ({
  // GitHub Pages project site: https://<user>.github.io/davinci-code-minigame/
  base: command === 'build' ? '/davinci-code-minigame/' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    // Prefer loopback for local preview reliability.
    // Phone testing: `npx vite --host`
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
  },
}))
