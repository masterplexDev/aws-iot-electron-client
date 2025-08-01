import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Electron용 상대 경로 설정
  base: './',
  server: {
    port: 5173,
    strictPort: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    exclude: ['aws-iot-device-sdk-v2'],
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      external: ['fs', 'path', 'crypto', 'util', 'stream', 'buffer'],
    },
  },
})