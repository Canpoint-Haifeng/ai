import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      'vue': 'vue/dist/vue.esm-bundler.js'
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  },
  server: {
    host: '0.0.0.0',
    port: 8080,
    strictPort: true,
    hmr: {
      clientPort: 443
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/css/variables.scss";`
      }
    }
  },
  define: {
    'process.env': {}
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true
    },
    chunkSizeWarningLimit: 1500,
    assetsDir: 'assets',
    outDir: 'dist'
  }
})
