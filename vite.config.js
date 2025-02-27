import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // Treat all tags with a dash as custom elements
          isCustomElement: (tag) => tag.includes('-'),
          // Enable Vue 2 compatible syntax
          compatConfig: {
            MODE: 2
          }
        }
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'vue': 'vue/dist/vue.esm-bundler.js'
    }
  },
  server: {
    port: 8080
  },
  define: {
    'process.env': {
      ...process.env,
      VITE_APP_VERSION: JSON.stringify(process.env.npm_package_version),
      VITE_APP_TITLE: JSON.stringify('备课助手'),
      VUE_APP_PAPER_GENERATOR: JSON.stringify(process.env.VITE_APP_PAPER_GENERATOR),
      VUE_APP_PAPER_GENERATOR_UPLOAD: JSON.stringify(process.env.VITE_APP_PAPER_GENERATOR_UPLOAD),
      VUE_APP_PAPER_GENERATOR_DOWNLOAD: JSON.stringify(process.env.VITE_APP_PAPER_GENERATOR_DOWNLOAD),
      VUE_APP_PAPER_GENERATOR_PREVIEW: JSON.stringify(process.env.VITE_APP_PAPER_GENERATOR_PREVIEW)
    }
  }
})
