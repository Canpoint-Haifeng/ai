import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    host: '0.0.0.0', // Listen on all network interfaces
    port: 8080,
    strictPort: true, // If port is already in use, exit
    hmr: {
      clientPort: 443 // Force the HMR client to use HTTPS
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/assets/css/variables" as *;`
      }
    }
  },
  define: {
    'process.env': {}
  }
})
