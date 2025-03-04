import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  base: '/lesson/',
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.includes('-'),
          compatConfig: {
            MODE: 2
          }
        }
      }
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'vue': '@vue/compat'
    }
  },
  server: {
    port: 8080,
    hmr: true,
    fs: {
      strict: false
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        charset: false,
        additionalData: `@use "@/assets/styles/variables.scss" as *;`
      }
    }
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
