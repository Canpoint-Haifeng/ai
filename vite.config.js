// ESM syntax for Vite configuration to avoid CJS deprecation warning
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import legacy from '@vitejs/plugin-legacy'
import { fileURLToPath } from 'url'

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.includes('-'),
          whitespace: 'preserve',
          comments: true,
          delimiters: ['{{', '}}']
        }
      },
      // Configure Vue 3 compatibility mode
      // https://v3-migration.vuejs.org/migration-build.html
      compilerOptions: {
        compatConfig: {
          MODE: 2,
          COMPONENT_V_MODEL: false,
          COMPILER_V_BIND_SYNC: false,
          COMPILER_V_BIND_OBJECT_ORDER: false,
          COMPILER_V_ON_NATIVE: false,
          COMPILER_NATIVE_TEMPLATE: false,
          INSTANCE_ATTRS_CLASS_STYLE: false,
          INSTANCE_LISTENERS: false,
          INSTANCE_SCOPED_SLOTS: false,
          RENDER_FUNCTION: false,
          GLOBAL_MOUNT: false
        }
      }
    }),
    legacy({
      targets: ['defaults', 'not IE 11'],
      modernPolyfills: true
    })
  ],
  base: '/lesson/',
  resolve: {
    alias: {
      '@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'src'),
      'vue': '@vue/compat'
    }
  },
  server: {
    port: 8080,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        charset: false,
        additionalData: '@import "@/assets/css/variables.scss";'
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    chunkSizeWarningLimit: 1500
  }
})
